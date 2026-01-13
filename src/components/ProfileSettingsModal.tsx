
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from "sonner";
// Remove direct supabase usage if not needed for Auth (but AuthContext uses it)
// We might still need it in this file? No, looks like only for profile data.
// But check imports.

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, updateProfile, changePassword } = useAuth();

    // Form State
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [twoFactorMethod, setTwoFactorMethod] = useState<string>('email');

    // Password Change State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);


    // Fetch initial profile data
    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                const data = await api.getProfile();
                if (data) {
                    setFullName(data.full_name || '');
                    setPhone(data.phone || '');
                    setIs2FAEnabled(data.is_2fa_enabled || false);
                    setTwoFactorMethod(data.two_factor_method || 'email');
                }
            } catch (err) {
                console.error("Failed to load profile settings", err);
            }
        };

        if (isOpen) {
            loadProfile();
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await updateProfile({
                full_name: fullName,
                phone: phone || undefined,
                is_2fa_enabled: is2FAEnabled,
                two_factor_method: twoFactorMethod
            });

            if (error) throw error;
            toast.success("Profile updated successfully");
            onClose();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const { error } = await changePassword(newPassword);
            if (error) throw error;
            toast.success("Password changed successfully");
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">Account Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">


                    {/* Profile Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Profile & Security</h3>
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1234567890"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">Required for SMS 2FA</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${is2FAEnabled ? 'bg-green-500' : 'bg-gray-300'}`} onClick={() => setIs2FAEnabled(!is2FAEnabled)}>
                                            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${is2FAEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </div>
                                        <label className="font-medium text-gray-700 cursor-pointer" onClick={() => setIs2FAEnabled(!is2FAEnabled)}>
                                            Enable Two-Factor Authentication (2FA)
                                        </label>
                                    </div>
                                </div>

                                {is2FAEnabled && (
                                    <div className="pl-13 animate-fadeIn">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Method</label>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all ${twoFactorMethod === 'email' ? 'border-[#1a365d] bg-blue-50/50 ring-1 ring-[#1a365d]' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <div className="flex items-center gap-3">
                                                    <input type="radio" name="2fa_method" value="email" checked={twoFactorMethod === 'email'} onChange={() => setTwoFactorMethod('email')} className="text-[#1a365d] focus:ring-[#1a365d]" />
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-900">Email</span>
                                                        <span className="block text-xs text-gray-500">Code sent to {user?.email}</span>
                                                    </div>
                                                </div>
                                            </label>
                                            <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-all ${twoFactorMethod === 'phone' ? 'border-[#1a365d] bg-blue-50/50 ring-1 ring-[#1a365d]' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <div className="flex items-center gap-3">
                                                    <input type="radio" name="2fa_method" value="phone" checked={twoFactorMethod === 'phone'} onChange={() => setTwoFactorMethod('phone')} className="text-[#1a365d] focus:ring-[#1a365d]" />
                                                    <div>
                                                        <span className="block text-sm font-medium text-gray-900">SMS</span>
                                                        <span className="block text-xs text-gray-500">Code sent to phone</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-2 gap-3">
                                <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a365d] hover:bg-[#0f2744] text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Password Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Change Password</h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent outline-none transition-all"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-transparent outline-none transition-all"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-2 gap-3">
                                <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading || !newPassword} className="px-6 py-2 bg-[#1a365d] hover:bg-[#0f2744] text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsModal;
