import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import UserTable from '@/components/admin/UserTable';
import { useData } from '@/contexts/DataContext';

import UserForm from '@/components/admin/UserForm';

const AdminDashboard: React.FC = () => {
    const { isAdmin, user, loading } = useAuth();
    const { notifications, markNotificationRead } = useData();
    const navigate = useNavigate();

    // Modal State
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    // Trigger refresh in table
    const [refreshKey, setRefreshKey] = useState(0);

    // Redirect if not admin
    React.useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/admin/login');
        }
    }, [isAdmin, loading, navigate]);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const handleEditUser = (user: any) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1); // Force table reload
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!isAdmin) return null; // Logic above handles redirect

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                notifications={notifications}
                onMarkNotificationRead={markNotificationRead}
                onOpenAuthModal={() => { }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage users, view system stats, and configure settings.</p>
                    </div>
                    <button
                        onClick={handleAddUser}
                        className="px-4 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#0f2744] font-medium flex items-center gap-2 shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add New User
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* User Management Section */}
                    <section>
                        <UserTable key={refreshKey} onEdit={handleEditUser} />
                    </section>

                    {/* Placeholder for future admin features */}
                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm opacity-50 pointer-events-none">
                        <h3 className="font-semibold text-gray-800 mb-4">System Settings (Coming Soon)</h3>
                        <p className="text-sm text-gray-500">Global configurations for currency, default language, and branding.</p>
                    </section>
                </div>
            </div>

            <UserForm
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSuccess={handleSuccess}
                editingUser={editingUser}
            />
        </div>
    );
};

export default AdminDashboard;
