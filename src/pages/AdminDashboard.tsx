import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import UserTable from '@/components/admin/UserTable';
import { useData } from '@/contexts/DataContext';

const AdminDashboard: React.FC = () => {
    const { isAdmin, user, loading } = useAuth();
    const { notifications, markNotificationRead } = useData();
    const navigate = useNavigate();

    // Redirect if not admin
    React.useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/');
        }
    }, [isAdmin, loading, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!isAdmin) return null; // Logic above handles redirect, this prevents flash

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Reusing Navbar for consistency, though we might want a simplified one */}
            <Navbar
                notifications={notifications}
                onMarkNotificationRead={markNotificationRead}
                onOpenAuthModal={() => { }}
                onOpenAdminModal={() => { }} // Not needed here
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage users, view system stats, and configure settings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* User Management Section */}
                    <section>
                        <UserTable />
                    </section>

                    {/* Placeholder for future admin features */}
                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm opacity-50 pointer-events-none">
                        <h3 className="font-semibold text-gray-800 mb-4">System Settings (Coming Soon)</h3>
                        <p className="text-sm text-gray-500">Global configurations for currency, default language, and branding.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
