import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase, supabaseUrl, supabaseKey } from '@/lib/supabase';
import { api } from '@/lib/api';

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
    const [accountType, setAccountType] = useState<'family' | 'personal'>('family');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && editingUser) {
            console.log("Editing User Data:", editingUser);
            setFullName(editingUser.full_name || '');
            setEmail(editingUser.email || '');
            setRole(editingUser.role || 'user');
            // Ensure exact match or fallback, handling mixed case just in case
            setAccountType((editingUser.account_type?.toLowerCase() as any) || 'family');
            setPassword(''); // Don't show password
        } else if (isOpen && !editingUser) {
            // Reset for new user
            setFullName('');
            setEmail('');
            setPassword('');
            setRole('user');
            setAccountType('family');
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
                    account_type: accountType
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
                            full_name: fullName,
                            role: role,
                            account_type: accountType
                        }
                    }
                });

                if (signUpError) throw signUpError;

                if (data.user) {
                    // 2. Create Profile in Neon (via Backend)
                    await api.createUser({
                        id: data.user.id,
                        email: email,
                        full_name: fullName,
                        role: role,
                        account_type: accountType,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a365d] outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a365d] outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                required
                                disabled={!!editingUser}
                            />
                            {editingUser && (
                                <button
                                    type="button"
                                    onClick={handleSendPasswordReset}
                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-xs font-medium whitespace-nowrap"
                                    title="Send Password Reset Email"
                                >
                                    Reset PWD
                                </button>
                            )}
                        </div>
                    </div>

                    {!editingUser && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a365d] outline-none"
                                required={!editingUser}
                                minLength={6}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a365d] outline-none"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="guest">Guest</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Account Type</label>
                            <select
                                value={accountType}
                                onChange={e => setAccountType(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1a365d] outline-none"
                            >
                                <option value="family">Family</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#0f2744] font-medium disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
