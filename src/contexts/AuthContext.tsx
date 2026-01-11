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
    try {
      // 1. Try to fetch fresh profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, account_type, full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Use Profile Data
        const type = profile.account_type;
        const name = profile.full_name;

        if (type === 'personal' && name) {
          setBranding(`${name}`);
        } else {
          setBranding('Family Estate');
        }

        setIsAdmin(profile.role === 'admin');
        return;
      }
    } catch (err) {
      console.error('Error fetching profile role:', err);
    }

    // 2. Fallback to Metadata (if profile query fails or no profile yet)
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
    setIsAdmin(false);
    setMustChangePassword(false);
    await supabase.auth.signOut();
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error ? (error as Error) : null };
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
