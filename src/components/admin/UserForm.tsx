import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase, supabaseUrl, supabaseKey } from '@/lib/supabase';
import { api } from '@/lib/api';
import ErrorBanner from '@/components/ui/ErrorBanner';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingUser: any | null;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSuccess, editingUser }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'guest' | 'user' | 'admin'>('user');
    const [phone, setPhone] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [twoFactorMethod, setTwoFactorMethod] = useState<string>('email');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && editingUser) {
            console.log("Editing User Data:", editingUser);
            setFullName(editingUser.full_name || '');
            setEmail(editingUser.email || '');
            setRole(editingUser.role || 'user');
            setPhone(editingUser.phone || '');
            setIs2FAEnabled(editingUser.is_2fa_enabled || false);
            setTwoFactorMethod(editingUser.two_factor_method || 'email');
            setPassword(''); // Don't show password
        } else if (isOpen && !editingUser) {
            // Reset for new user
            setFullName('');
            setEmail('');
            setPassword('');
            setRole('user');
            setPhone('');
            setIs2FAEnabled(false);
            setTwoFactorMethod('email');
        }
        setError(null);
    }, [isOpen, editingUser]);

    const handleSendPasswordReset = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password',
            });
            if (error) throw error;
            alert('Password reset email sent to ' + email);
        } catch (err: any) {
            alert('Error sending reset email: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (editingUser) {
                // UPDATE USER
                // Update Neon Data
                await api.updateUser(editingUser.id, {
                    full_name: fullName,
                    role: role,
                    phone: phone || null,
                    is_2fa_enabled: is2FAEnabled,
                    two_factor_method: twoFactorMethod
                });

                // Note: We don't update Email/Password here as that requires Auth API/Client handling
            } else {
                // CREATE USER
                if (password.length < 6) throw new Error("Password must be at least 6 characters");

                // 1. Create Auth User in Supabase (DatabasePad)
                // Hack: Create a temporary client that DOES NOT persist session
                const tempClient = createClient(supabaseUrl, supabaseKey, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                        detectSessionInUrl: false
                    }
                });

                const { data, error: signUpError } = await tempClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                });

                if (signUpError) {
                    if (signUpError.message?.includes('already registered')) {
                        // Soft error: User exists in Auth but maybe not in Data
                        console.warn("User already exists in Auth. Cannot retrieve UID to force-create Profile.");
                        throw new Error("This email is already registered in the Login System. If this is YOU, please close this form and Refresh the page to sync your profile. If it is someone else, ask them to Log In.");
                    }
                    throw signUpError;
                }

                if (data.user) {
                    // 2. Create Profile in Neon (via Backend)
                    await api.createUser({
                        id: data.user.id,
                        email: email,
                        full_name: fullName,
                        role: role,
                        phone: phone || null,
                        is_2fa_enabled: is2FAEnabled,
                        two_factor_method: twoFactorMethod,
                        status: 'active'
                    });
                }
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("User Form Error:", err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gradient-to-r from-[#1a365d] to-[#0f2744] px-8 py-6 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 className="text-xl font-bold">{editingUser ? 'Edit User Profile' : 'Add New Member'}</h3>
                        <p className="text-blue-200 text-xs mt-1">Manage access and permissions</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="overflow-y-auto p-8">
                    <ErrorBanner error={error} className="mb-6" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:bg-white transition-all outline-none text-sm font-medium"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:bg-white transition-all outline-none text-sm disabled:opacity-60"
                                        placeholder="john@example.com"
                                        required
                                        disabled={!!editingUser}
                                    />
                                    {editingUser && (
                                        <button
                                            type="button"
                                            onClick={handleSendPasswordReset}
                                            className="px-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-xs font-bold whitespace-nowrap transition-colors"
                                            title="Send Password Reset Email"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:bg-white transition-all outline-none text-sm"
                                    placeholder="+1 (555) 000-0000"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">Required for SMS 2FA</p>
                            </div>

                            {!editingUser && (
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:bg-white transition-all outline-none text-sm"
                                        required={!editingUser}
                                        minLength={6}
                                        placeholder="••••••••"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                                <div className="relative">
                                    <select
                                        value={role}
                                        onChange={e => setRole(e.target.value as any)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:bg-white transition-all outline-none text-sm appearance-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="guest">Guest</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is2FAEnabled"
                                    checked={is2FAEnabled}
                                    onChange={(e) => setIs2FAEnabled(e.target.checked)}
                                    className="w-5 h-5 text-[#1a365d] border-gray-300 rounded focus:ring-[#1a365d] cursor-pointer"
                                />
                                <label htmlFor="is2FAEnabled" className="text-sm font-semibold text-gray-800 cursor-pointer select-none">
                                    Enforce 2FA Security
                                </label>
                            </div>

                            {is2FAEnabled && (
                                <div className="pl-8 animate-in slide-in-from-top-1 fade-in">
                                    <label className="block text-xs font-bold text-yellow-700 uppercase tracking-wider mb-2">Preferred Method</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setTwoFactorMethod('email')}
                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${twoFactorMethod === 'email' ? 'bg-[#1a365d] text-white border-[#1a365d]' : 'bg-white text-gray-600 border-gray-200'}`}
                                        >
                                            Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTwoFactorMethod('phone')}
                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${twoFactorMethod === 'phone' ? 'bg-[#1a365d] text-white border-[#1a365d]' : 'bg-white text-gray-600 border-gray-200'}`}
                                        >
                                            SMS (Phone)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-2 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#1a365d] text-white rounded-xl hover:bg-[#0f2744] font-bold shadow-lg shadow-blue-900/10 disabled:opacity-70 transition-all transform active:scale-95"
                            >
                                {loading ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
