import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ErrorBanner: React.FC<{ error: string | null }> = ({ error }) => {
    if (!error) return null;

    // Parse the error string from api.ts (format: "Msg | DETAILS: ... | DEBUG: ...")
    const parts = error.split('|').map(s => s.trim());
    const mainMsg = parts[0];
    const details = parts.find(p => p.startsWith('DETAILS:'))?.replace('DETAILS:', '').trim();
    const debug = parts.find(p => p.startsWith('DEBUG:'))?.replace('DEBUG:', '').trim();

    return (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-red-900 font-bold text-sm mb-1">Action Failed</h3>
                    <p className="text-red-700 text-sm font-medium">{mainMsg}</p>

                    {(details || debug) && (
                        <div className="mt-3 bg-white/50 rounded-lg p-3 text-xs font-mono border border-red-100 overflow-x-auto">
                            {details && (
                                <div className="mb-1">
                                    <span className="font-bold text-red-800">Error:</span>{' '}
                                    <span className="text-red-700">{details}</span>
                                </div>
                            )}
                            {debug && (
                                <div>
                                    <span className="font-bold text-red-800">Debug:</span>{' '}
                                    <span className="text-red-700">{debug}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-2 text-[10px] text-red-400">
                        {new Date().toLocaleTimeString()} • backend logs may have more info
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
    const { signUp } = useAuth();

    // Real Supabase Data
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        try {
            const data = await api.getUsers();
            if (data) setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    // Form States
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<'family' | 'personal'>('family');
    const [role, setRole] = useState<'guest' | 'user' | 'admin'>('user');

    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [twoFactorMethod, setTwoFactorMethod] = useState<string>('email');
    const [phone, setPhone] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const resetForm = () => {
        setEditingUser(null);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAccountType('family');

        setRole('user');

        setTwoFactorMethod('email');
        setIs2FAEnabled(false);
        setPhone('');
        setShowResetPassword(false);
        setError(null);
        setSuccess(null);
    };

    if (!isOpen) return null;

    const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validation
        if (!editingUser || showResetPassword) {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                setLoading(false);
                return;
            }
        }

        if (!editingUser) {
            // Create Real User
            // Note: signUp automatically signs in the new user in client-side Auth.
            // This is a known limitation without Admin API.
            const { error: signUpError } = await signUp(email, password, fullName, accountType);

            if (signUpError) {
                setError(signUpError.message);
            } else {
                // Update additional fields (Role, Phone, 2FA) via Backend
                // The signUp function already creates the profile via api.createUser
                // We need to update it with additional fields like role, phone, 2FA
                try {
                    // Get the current session to retrieve the user ID
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        await api.updateUser(session.user.id, {
                            role,
                            phone: phone || null,
                            is_2fa_enabled: is2FAEnabled,
                            two_factor_method: twoFactorMethod,
                        });
                    }

                    setSuccess('User created successfully. (You might be logged in as the new user)');
                    fetchUsers();
                    resetForm();
                } catch (error: any) {
                    setError(error.message || 'User created but failed to set additional fields');
                }
            }
        } else {
            // Update Real User Profile via Backend API
            const updates: any = {
                full_name: fullName,
                role: role,
                account_type: accountType,
                is_2fa_enabled: is2FAEnabled,
                two_factor_method: twoFactorMethod,
                phone: phone || null,
                email: email
            };

            try {
                await api.updateUser(editingUser, updates);

                if (showResetPassword) {
                    setError("Password reset requires Admin Backend API. Profile updated only.");
                } else {
                    setSuccess('User profile updated successfully.');
                }
                fetchUsers();
                resetForm();
            } catch (error: any) {
                setError(error.message || 'Failed to update user profile');
            }
        }

        setLoading(false);
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user.id);
        setFullName(user.full_name);
        setEmail(user.email);
        setRole(user.role);
        setAccountType(user.account_type);

        setIs2FAEnabled(user.is_2fa_enabled || false);
        setTwoFactorMethod(user.two_factor_method || 'email');
        setPhone(user.phone || '');
        setPassword('');
        setConfirmPassword('');
        setShowResetPassword(false);
        setError(null);
    };

    const handleToggleStatus = async (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const newStatus = user.status === 'active' ? 'disabled' : 'active';
        try {
            await api.updateUser(userId, { status: newStatus });
            fetchUsers();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This will delete their profile data.')) {
            try {
                await api.deleteUser(userId);
                fetchUsers();
            } catch (error: any) {
                alert('Error deleting user: ' + error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-800 to-red-900 p-6 flex justify-between items-center text-white flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">User Management</h2>
                        <p className="text-red-200 text-sm">Create, edit, and manage system access</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left: Form */}
                    <div className="w-1/3 p-6 border-r border-gray-100 overflow-y-auto bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>

                        <ErrorBanner error={error} />
                        {success && <div className="mb-4 p-2 bg-green-50 text-green-600 text-xs rounded-lg border border-green-100">{success}</div>}

                        <form onSubmit={handleCreateOrUpdateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                    required
                                    disabled={!!editingUser}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number (Required for SMS 2FA)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                    placeholder="+1234567890"
                                />
                            </div>

                            {!editingUser || showResetPassword ? (
                                <div className="grid grid-cols-1 gap-2">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        {showResetPassword ? 'New Password' : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                        placeholder={showResetPassword ? "New Password" : "Password"}
                                        required
                                    />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                        placeholder="Confirm"
                                        required
                                    />
                                    {showResetPassword && (
                                        <button
                                            type="button"
                                            onClick={() => setShowResetPassword(false)}
                                            className="text-xs text-gray-500 hover:text-gray-700 text-left underline"
                                        >
                                            Cancel Reset
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setShowResetPassword(true)}
                                        className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm hover:bg-yellow-100 w-full"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            )}



                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as any)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                >
                                    <option value="guest">Guest</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Account Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAccountType('family')}
                                        className={`p-2 rounded-lg border text-center text-xs transition-all ${accountType === 'family' ? 'bg-[#1a365d] text-white border-[#1a365d]' : 'bg-white border-gray-200 text-gray-600'}`}
                                    >
                                        Family
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccountType('personal')}
                                        className={`p-2 rounded-lg border text-center text-xs transition-all ${accountType === 'personal' ? 'bg-[#1a365d] text-white border-[#1a365d]' : 'bg-white border-gray-200 text-gray-600'}`}
                                    >
                                        Personal
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is2FAEnabled"
                                        checked={is2FAEnabled}
                                        onChange={(e) => setIs2FAEnabled(e.target.checked)}
                                        className="w-4 h-4 text-[#1a365d] border-gray-300 rounded focus:ring-[#1a365d]"
                                    />
                                    <label htmlFor="is2FAEnabled" className="text-xs font-medium text-gray-500 select-none cursor-pointer">
                                        Enable 2FA
                                    </label>
                                </div>

                                {is2FAEnabled && (
                                    <div className="pl-6">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">2FA Method</label>
                                        <select
                                            value={twoFactorMethod}
                                            onChange={(e) => setTwoFactorMethod(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1a365d] outline-none"
                                        >
                                            <option value="email">Email</option>
                                            <option value="phone">Phone (SMS)</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                {editingUser && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-[#1a365d] hover:bg-[#0f2744] text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                                >
                                    {editingUser ? 'Save' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: List */}
                    <div className="w-2/3 p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Existing Users</h3>
                            <button onClick={fetchUsers} className="text-xs text-[#1a365d] hover:underline flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Refresh
                            </button>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                    <tr>
                                        <th className="p-3 font-medium">User</th>
                                        <th className="p-3 font-medium">Role</th>
                                        <th className="p-3 font-medium">Type</th>
                                        <th className="p-3 font-medium">Status</th>
                                        <th className="p-3 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50/50">
                                            <td className="p-3">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-medium text-gray-900">{u.full_name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-gray-400 text-xs">{u.email}</p>
                                                        {u.is_2fa_enabled && (
                                                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-bold border border-purple-200" title="2FA Enabled">
                                                                2FA
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                    u.role === 'guest' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {u.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="capitalize text-gray-600 text-xs">{u.account_type || '-'}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' || !u.status ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' || !u.status ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {u.status === 'active' || !u.status ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => handleEditClick(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => handleToggleStatus(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' || !u.status ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`} title={u.status === 'active' || !u.status ? 'Disable' : 'Enable'}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-400">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementModal;
