import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
// import { supabase } from '@/lib/supabase'; // Legacy
import { useAuth } from '@/contexts/AuthContext';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'admin' | 'user' | 'guest';
    status: 'active' | 'disabled';
    created_at: string;
}

interface UserTableProps {
    onEdit?: (user: User) => void;
    // key prop is handled by React automatically
}

const UserTable: React.FC<UserTableProps> = ({ onEdit }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getUsers();
            // Backend returns array of profiles
            setUsers(data || []);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        try {
            await api.updateUser(userId, { status: newStatus });
            fetchUsers();
        } catch (err: any) {
            alert('Error updating status: ' + err.message);
        }
    };

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user? This will delete their profile data.')) {
            try {
                await api.deleteUser(userId);
                fetchUsers();
            } catch (err: any) {
                alert('Error deleting user: ' + err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">System Users ({users.length})</h3>
                <button onClick={fetchUsers} className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Refresh
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                        <tr>
                            <th className="p-3 font-medium">User</th>
                            <th className="p-3 font-medium">Role</th>
                            <th className="p-3 font-medium">Status</th>
                            <th className="p-3 font-medium">Joined</th>
                            <th className="p-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">

                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3">
                                    <p className="font-medium text-gray-900">{u.full_name || 'No Name'}</p>
                                    <p className="text-gray-400 text-xs">{u.email}</p>
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
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' || !u.status ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' || !u.status ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></span>
                                        {u.status === 'active' || !u.status ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-500 text-xs">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => onEdit && onEdit(u)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button onClick={() => handleToggleStatus(u.id, u.status)} className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' || !u.status ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                                            }`} title={u.status === 'active' || !u.status ? 'Disable' : 'Enable'}>
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
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    No users found.
                                    <br />
                                    <span className="text-xs">If you are an admin, check RLS policies.</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
