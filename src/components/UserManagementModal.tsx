import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose }) => {
    const { signUp } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<'family' | 'personal'>('family');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

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

        const { error } = await signUp(email, password, fullName, accountType);

        if (error) {
            setError(error.message);
        } else {
            setSuccess('User account created successfully.');
            // Reset form
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setAccountType('family');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-800 to-red-900 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">User Management</h2>
                        <p className="text-red-200 text-sm">Create and manage user accounts</p>
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

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleCreateUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setAccountType('family')}
                                    className={`p-3 rounded-xl border text-center transition-all ${accountType === 'family'
                                            ? 'border-[#1a365d] bg-[#1a365d] text-white'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-semibold">Family Estate</div>
                                    <div className="text-xs opacity-80">Standard Branding</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAccountType('personal')}
                                    className={`p-3 rounded-xl border text-center transition-all ${accountType === 'personal'
                                            ? 'border-[#1a365d] bg-[#1a365d] text-white'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="font-semibold">Personal</div>
                                    <div className="text-xs opacity-80">Name Branding</div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] outline-none"
                                placeholder="Enter user's full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] outline-none"
                                placeholder="user@example.com"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be the username for login.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] outline-none"
                                    placeholder="Min. 6 chars"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] outline-none"
                                    placeholder="Confirm"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 px-6 py-3 bg-[#1a365d] hover:bg-[#0f2744] text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Create User Account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserManagementModal;
