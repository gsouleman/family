import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ErrorBanner from '@/components/ui/ErrorBanner';

const AdminLogin: React.FC = () => {
    const { signIn, verify2FA, isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // 0 = Credentials, 1 = 2FA
    const [step, setStep] = useState<0 | 1>(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [method, setMethod] = useState<string>('email');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already admin
    useEffect(() => {
        if (!authLoading && isAdmin) {
            navigate('/admin');
        }
    }, [isAdmin, authLoading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError, needs2FA, method: twoFactorMethod } = await signIn(email, password);

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            if (needs2FA) {
                setMethod(twoFactorMethod || 'email');
                setStep(1);
                setLoading(false);
            } else {
                // Success - Context will update isAdmin, triggering redirect
                // wait a bit for context updates
                setTimeout(() => {
                    navigate('/admin');
                }, 500);
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
            setLoading(false);
        }
    };

    const handleVerifyParams = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: verifyError } = await verify2FA(email, otp);
        if (verifyError) {
            setError(verifyError.message);
            setLoading(false);
        } else {
            // Success
            setTimeout(() => {
                navigate('/admin');
            }, 500);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-[#d4af37] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                    Administrator Access
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Secure gateway for user management
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
                    <ErrorBanner error={error} className="mb-6" />

                    {step === 0 ? (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Admin Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a365d] hover:bg-[#0f2744] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a365d] disabled:opacity-50"
                                >
                                    {loading ? 'Authenticating...' : 'Sign in'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyParams}>
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">
                                    <svg className="w-6 h-6 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter the code sent to your {method === 'email' ? 'email' : 'phone'}
                                </p>
                            </div>

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center">
                                    Verification Code
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm text-center text-2xl tracking-widest font-mono"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(0)}
                                    className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a365d] hover:bg-[#0f2744] focus:outline-none disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
