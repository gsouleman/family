import React, { useState, useEffect } from 'react';
import { LedgerEntry, LedgerCategory, LedgerType } from '../types';
import { useCurrency } from '@/contexts/CurrencyContext';
import { api } from '@/lib/api';
import PrintButton from './PrintButton';

const LedgerDashboard: React.FC = () => {
    const { formatCurrency } = useCurrency();
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'expense'>('overview');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'INCOME' as LedgerType,
        category: 'SALARY' as LedgerCategory,
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/ledger');
            setEntries(data);
        } catch (error) {
            console.error('Failed to fetch ledger:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/ledger', formData);
            setShowModal(false);
            fetchEntries();
            // Reset form
            setFormData({
                title: '',
                amount: '',
                type: 'INCOME',
                category: 'SALARY',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
        } catch (error) {
            alert('Failed to save entry');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this entry?')) {
            try {
                await api.delete(`/ledger/${id}`);
                fetchEntries();
            } catch (error) {
                alert('Failed to delete');
            }
        }
    };

    // Filter Logic
    const incomes = entries.filter(e => e.type === 'INCOME');
    const expenses = entries.filter(e => e.type === 'EXPENSE');
    const totalIncome = incomes.reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    const displayedEntries = activeTab === 'overview' ? entries : activeTab === 'income' ? incomes : expenses;

    return (
        <section id="ledger" className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-[#1a365d]">Financial Ledger</h2>
                        <p className="text-gray-500">Track incomes, expenses, and general balance.</p>
                    </div>
                    <div className="flex gap-3">
                        <PrintButton title="Print Ledger" />
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-[#d4af37] text-[#1a365d] rounded-lg font-semibold hover:bg-[#c9a432] transition-colors"
                        >
                            + Add Entry
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <p className="text-green-600 font-medium text-sm uppercase">Total Income</p>
                        <p className="text-3xl font-bold text-green-700 mt-2">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <p className="text-red-600 font-medium text-sm uppercase">Total Expenses</p>
                        <p className="text-3xl font-bold text-red-700 mt-2">{formatCurrency(totalExpense)}</p>
                    </div>
                    <div className="bg-[#1a365d]/5 p-6 rounded-2xl border border-[#1a365d]/10">
                        <p className="text-[#1a365d] font-medium text-sm uppercase">Net Balance</p>
                        <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-[#1a365d]' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 no-print">
                    {(['overview', 'income', 'expense'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-[#d4af37] text-[#1a365d]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full print-table">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase no-print">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {displayedEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                        No entries found.
                                    </td>
                                </tr>
                            ) : (
                                displayedEntries.map(entry => (
                                    <tr key={entry.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {entry.title}
                                            {entry.description && <div className="text-xs text-gray-400 font-normal">{entry.description}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                {entry.category.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${entry.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {entry.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-sm font-bold text-right ${entry.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {entry.type === 'INCOME' ? '+' : '-'}{formatCurrency(entry.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right no-print">
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                className="text-red-400 hover:text-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Entry Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-[#1a365d] mb-4">Add Ledger Entry</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as LedgerType })}
                                    >
                                        <option value="INCOME">Income</option>
                                        <option value="EXPENSE">Expense</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] outline-none"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value as LedgerCategory })}
                                >
                                    {formData.type === 'INCOME' ? (
                                        <>
                                            <option value="SALARY">Salary</option>
                                            <option value="BUSINESS">Business</option>
                                            <option value="RENTAL">Rental</option>
                                            <option value="DIVIDEND">Dividend</option>
                                            <option value="OTHER_INCOME">Other</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="UTILITIES">Utilities</option>
                                            <option value="MAINTENANCE">Maintenance</option>
                                            <option value="TAX">Tax</option>
                                            <option value="DEBT">Debt</option>
                                            <option value="PERSONAL">Personal</option>
                                            <option value="OTHER_EXPENSE">Other</option>
                                        </>
                                    )}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4af37] outline-none"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#1a365d] text-white rounded-lg font-medium hover:bg-[#0f2744]"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default LedgerDashboard;
