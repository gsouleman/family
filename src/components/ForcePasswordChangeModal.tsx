import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ForcePasswordChangeModal: React.FC = () => {
    const { changePassword, signOut } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

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

        const { error } = await changePassword(password);

        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-red-600 p-8 text-center">
                    <svg className="w-12 h-12 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white">Security Update Required</h2>
                    <p className="text-red-100 mt-2">You must change your password to continue.</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600 outline-none"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>

                        <div className="text-center mt-4">
                            <button type="button" onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700 underline">
                                Sign Out
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForcePasswordChangeModal;
