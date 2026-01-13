import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ErrorBanner from '@/components/ui/ErrorBanner';

const Register: React.FC = () => {
    const { signUp, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState<'personal' | 'family'>('family');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
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

        if (!agreeToTerms) {
            setError('You must agree to the terms and conditions');
            setLoading(false);
            return;
        }

        try {
            const { error: signUpError } = await signUp(email, password, fullName, accountType);

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'Registration failed');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-12 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h3>
                        <p className="text-gray-600">
                            Your account has been successfully created. Redirecting to login...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#0f2744] rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-[#1a365d] hover:text-[#0f2744]">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
                    <ErrorBanner error={error} className="mb-6" />

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
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
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm"
                                    placeholder="you@example.com"
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
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1a365d] focus:border-[#1a365d] sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAccountType('family')}
                                    className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${accountType === 'family'
                                            ? 'border-[#1a365d] bg-[#1a365d] text-white'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Family
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAccountType('personal')}
                                    className={`py-3 px-4 border-2 rounded-lg text-sm font-medium transition-colors ${accountType === 'personal'
                                            ? 'border-[#1a365d] bg-[#1a365d] text-white'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                >
                                    <div className="flex flex-col items-center">
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="agreeToTerms"
                                name="agreeToTerms"
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="h-4 w-4 text-[#1a365d] focus:ring-[#1a365d] border-gray-300 rounded"
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <a href="#" className="text-[#1a365d] hover:text-[#0f2744]">
                                    Terms and Conditions
                                </a>
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || authLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1a365d] hover:bg-[#0f2744] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a365d] disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">
                    Secure registration for family asset management
                </p>
            </div>
        </div>
    );
};

export default Register;
