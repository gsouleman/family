import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
    const { signUp } = useAuth();
    // Use local state backed by localStorage
    const [users, setUsers] = useState<any[]>(() => {
        const stored = localStorage.getItem('mockUsers');
        if (stored) return JSON.parse(stored);
        return [
            { id: '1', full_name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user', account_type: 'personal', status: 'active', created_at: new Date().toISOString() },
            { id: '2', full_name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'guest', account_type: 'family', status: 'disabled', created_at: new Date().toISOString() }
        ];
    });

    // Save to localStorage whenever users change
    const updateUsers = (newUsers: any[]) => {
        setUsers(newUsers);
        localStorage.setItem('mockUsers', JSON.stringify(newUsers));
    };

    // Form States
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<'family' | 'personal'>('family');
    const [role, setRole] = useState<'guest' | 'user' | 'admin'>('user');
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
        setError(null);
        setSuccess(null);
    };

    if (!isOpen) return null;

    const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!editingUser) {
            // Validate Password for new users
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

            // Mock Create Logic
            const newUser = {
                id: `user-${Date.now()}`,
                full_name: fullName,
                email,
                role,
                account_type: accountType,
                status: 'active',
                created_at: new Date().toISOString()
            };

            // Try actual signup if it's a real backend (skipped here for pure mock demo of UI)
            // const { error } = await signUp(email, password, fullName, accountType);

            setUsers([...users, newUser]);
            setSuccess('User created successfully.');
            resetForm();
        } else {
            // Update Logic
            const updatedUsers = users.map(u => {
                if (u.id === editingUser) {
                    return { ...u, full_name: fullName, email, role, account_type: accountType };
                }
                return u;
            });
            setUsers(updatedUsers);
            setSuccess('User updated successfully.');
            resetForm();
        }

        setLoading(false);
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user.id);
        setFullName(user.full_name);
        setEmail(user.email);
        setRole(user.role);
        setAccountType(user.account_type);
        setPassword(''); // Don't show password
        setConfirmPassword('');
        setError(null);
    };

    const handleToggleStatus = (userId: string) => {
        setUsers(users.map(u => {
            if (u.id === userId) {
                return { ...u, status: u.status === 'active' ? 'disabled' : 'active' };
            }
            return u;
        }));
    };

    const handleDelete = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
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

                        {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">{error}</div>}
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
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{users.length} Users</span>
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
                                                <p className="font-medium text-gray-900">{u.full_name}</p>
                                                <p className="text-gray-400 text-xs">{u.email}</p>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-red-50 text-red-600' :
                                                    u.role === 'guest' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="capitalize text-gray-600 text-xs">{u.account_type}</span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                    {u.status === 'active' ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => handleEditClick(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => handleToggleStatus(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`} title={u.status === 'active' ? 'Disable' : 'Enable'}>
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
