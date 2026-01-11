import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  mustChangePassword: boolean;
  branding: string;
  signUp: (email: string, password: string, fullName: string, accountType: 'personal' | 'family') => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: { full_name?: string }) => Promise<{ error: Error | null }>;
  changePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [branding, setBranding] = useState('Family Estate');

  useEffect(() => {
    // Check for mock admin session in local storage
    const mockAdmin = localStorage.getItem('mockAdminSession');
    if (mockAdmin) {
      const adminUser = JSON.parse(mockAdmin);
      setUser(adminUser);
      setIsAdmin(true);
      setMustChangePassword(adminUser.user_metadata?.mustChangePassword || false);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        checkUserRole(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
        checkUserRole(session.user);
      } else {
        setUser(null);
        setIsAdmin(false);
        setBranding('Family Estate');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (user: User) => {
    // Check branding
    const type = user.user_metadata?.account_type;
    const name = user.user_metadata?.full_name;

    if (type === 'personal' && name) {
      setBranding(`${name}`);
    } else {
      setBranding('Family Estate');
    }

    // Check admin role from metadata
    setIsAdmin(user.user_metadata?.role === 'admin');
  };

  const signUp = async (email: string, password: string, fullName: string, accountType: 'personal' | 'family') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            account_type: accountType,
            role: 'user', // Default role
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          account_type: accountType,
          created_at: new Date().toISOString(),
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Handle Default Admin Login
    if (email === 'Admin' || email === 'admin') {
      const storedPassword = localStorage.getItem('adminPassword') || 'admin';

      if (password === storedPassword) {
        const mockAdminUser = {
          id: 'admin-user',
          email: 'admin@system.local',
          user_metadata: {
            full_name: 'Administrator',
            role: 'admin',
            mustChangePassword: storedPassword === 'admin', // Force change if still default
            account_type: 'family'
          },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as any;

        localStorage.setItem('mockAdminSession', JSON.stringify(mockAdminUser));
        setUser(mockAdminUser);
        setIsAdmin(true);
        setMustChangePassword(mockAdminUser.user_metadata.mustChangePassword);
        return { error: null };
      } else {
        return { error: new Error('Invalid login credentials') };
      }
    }

    // Normal Supabase Login
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('mockAdminSession');
    setIsAdmin(false);
    setMustChangePassword(false);
    await supabase.auth.signOut();
  };

  const changePassword = async (newPassword: string) => {
    if (user?.id === 'admin-user') {
      // Update mock admin
      const updatedAdmin = {
        ...user,
        user_metadata: { ...user.user_metadata, mustChangePassword: false }
      };
      localStorage.setItem('mockAdminSession', JSON.stringify(updatedAdmin));
      localStorage.setItem('adminPassword', newPassword); // Persist the new password
      setUser(updatedAdmin);
      setMustChangePassword(false);
      return { error: null };
    } else {
      // Supabase update
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error: error ? (error as Error) : null };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateProfile = async (data: { full_name?: string }) => {
    try {
      if (!user) throw new Error('No user logged in');
      if (user.id === 'admin-user') return { error: null };

      const { error } = await supabase.auth.updateUser({
        data: data,
      });

      if (error) throw error;

      await supabase.from('profiles').update({
        full_name: data.full_name,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    mustChangePassword,
    branding,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
