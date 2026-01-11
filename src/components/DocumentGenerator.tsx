import React, { useState } from 'react';
import { Heir, Asset, Document } from '../types';
import { useCurrency } from '@/contexts/CurrencyContext';

interface DocumentGeneratorProps {
    heirs: Heir[];
    activeAssets: Asset[];
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ heirs, activeAssets }) => {
    const { formatCurrency } = useCurrency();
    const [activeModal, setActiveModal] = useState<Document['type'] | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [liabilities, setLiabilities] = useState<{ id: string; creditor: string; amount: number }[]>([]);
    const [newLiability, setNewLiability] = useState({ creditor: '', amount: '' });

    // Calculations
    const totalAssets = activeAssets.reduce((acc, curr) => acc + curr.value, 0);
    const totalLiabilities = liabilities.reduce((acc, curr) => acc + curr.amount, 0);
    const netEstate = totalAssets - totalLiabilities;

    const handlePrint = () => {
        window.print();
    };

    const addLiability = () => {
        if (!newLiability.creditor || !newLiability.amount) return;
        setLiabilities([...liabilities, {
            id: Math.random().toString(36).substr(2, 9),
            creditor: newLiability.creditor,
            amount: parseFloat(newLiability.amount)
        }]);
        setNewLiability({ creditor: '', amount: '' });
    };

    const removeLiability = (id: string) => {
        setLiabilities(liabilities.filter(l => l.id !== id));
    };

    const documentTypes: { type: Document['type']; label: string }[] = [
        { type: 'will', label: 'Islamic Will' },
        { type: 'deed', label: 'Property Deed' },
        { type: 'certificate', label: 'Certificate' },
        { type: 'contract', label: 'Contract' },
    ];

    const handleSelectType = (type: Document['type']) => {
        setActiveModal(type);
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-6 py-2 bg-[#d4af37] text-[#1a365d] font-semibold rounded-lg hover:bg-[#c9a432] transition-colors flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Document
                <svg className={`w-4 h-4 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {showDropdown && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                        {documentTypes.map((doc) => (
                            <button
                                key={doc.type}
                                onClick={() => handleSelectType(doc.type)}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#1a365d] transition-colors"
                            >
                                {doc.label}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {activeModal === 'will' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:static print:bg-white print:p-0">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:shadow-none print:w-full">
                        <div className="p-8 print:p-0">
                            {/* Header Buttons */}
                            <div className="flex justify-between items-start mb-8 print:hidden">
                                <h2 className="text-2xl font-bold text-[#1a365d]">Last Will and Testament</h2>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Data Entry Section - Print Hidden */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 print:hidden">
                                <h3 className="text-lg font-bold text-[#1a365d] mb-4">Add Liabilities / Debts</h3>
                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Creditor Name"
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                        value={newLiability.creditor}
                                        onChange={e => setNewLiability({ ...newLiability, creditor: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        className="w-32 px-3 py-2 border rounded-lg"
                                        value={newLiability.amount}
                                        onChange={e => setNewLiability({ ...newLiability, amount: e.target.value })}
                                        onKeyDown={e => e.key === 'Enter' && addLiability()}
                                    />
                                    <button
                                        onClick={addLiability}
                                        className="px-4 py-2 bg-[#d4af37] text-[#1a365d] font-bold rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                                {liabilities.length > 0 && (
                                    <ul className="space-y-2">
                                        {liabilities.map(l => (
                                            <li key={l.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                                                <span>{l.creditor} - {formatCurrency(l.amount)}</span>
                                                <button onClick={() => removeLiability(l.id)} className="text-red-500 hover:text-red-700">Remove</button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Will Content */}
                            <div className="prose max-w-none font-serif text-gray-900 border-[6px] border-[#d4af37]/20 p-12 print:border-none print:p-0">
                                <div className="text-center mb-12">
                                    <div className="text-[#d4af37] text-4xl mb-4">﷽</div>
                                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Islamic Will</h1>
                                    <p className="text-sm text-gray-500">(Al-Wasiyya)</p>
                                </div>

                                <div className="space-y-6">
                                    <p className="indent-8 text-justify">
                                        I, the undersigned, being of sound mind and memory, do hereby declare this to be my Last Will and Testament, revoking all former wills and codicils made by me.
                                    </p>

                                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mt-8">Article I: Declaration of Faith</h3>
                                    <p className="text-justify">
                                        I bear witness that there is no deity arising to worship except Allah, and that Muhammad (peace be upon him) is His Servant and Messenger. I ask my relatives and friends to be patient with the decree of Allah, and to pray for me for mercy and forgiveness.
                                    </p>

                                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mt-8">Article II: Executors and Guardians</h3>
                                    <p>
                                        I hereby appoint the following person(s) as Executor(s) of this Will to settle my estate in accordance with Islamic Law (Shariah):
                                        <br /><br />
                                        <span className="inline-block w-full border-b border-gray-300 h-6"></span>
                                    </p>

                                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mt-8">Article III: Assets and Liabilities</h3>
                                    <p>My Net Estate Value as of {new Date().toLocaleDateString()} is approximately <strong>{formatCurrency(netEstate)}</strong>.</p>

                                    <div className="grid grid-cols-2 gap-8 mt-4">
                                        <div>
                                            <h4 className="font-bold underline mb-2">Assets</h4>
                                            <ul className="list-disc ml-6">
                                                {activeAssets.map(asset => (
                                                    <li key={asset.id}>{asset.name} ({formatCurrency(asset.value)})</li>
                                                ))}
                                            </ul>
                                            <p className="mt-2 text-sm font-bold border-t pt-1">Total Assets: {formatCurrency(totalAssets)}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold underline mb-2">Liabilities (Debts)</h4>
                                            {liabilities.length > 0 ? (
                                                <ul className="list-disc ml-6">
                                                    {liabilities.map(l => (
                                                        <li key={l.id}>{l.creditor} ({formatCurrency(l.amount)})</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="italic text-gray-500">None declared.</p>
                                            )}
                                            <p className="mt-2 text-sm font-bold border-t pt-1">Total Liabilities: {formatCurrency(totalLiabilities)}</p>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mt-8">Article IV: Settlement of Debts</h3>
                                    <p className="text-justify">
                                        I direct my Executor(s) to pay all my legal debts and funeral expenses as soon as possible after my death, before any distribution of my estate to my heirs.
                                        Specifically, the following debts should be prioritized:
                                    </p>
                                    {liabilities.length > 0 ? (
                                        <ul className="list-disc ml-6 mt-2">
                                            {liabilities.map(l => (
                                                <li key={l.id}>
                                                    Amount of <strong>{formatCurrency(l.amount)}</strong> owed to <strong>{l.creditor}</strong>.
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-2 italic">I have no known outstanding debts at this time.</p>
                                    )}

                                    <h3 className="text-xl font-bold border-b border-gray-200 pb-2 mt-8">Article V: Distribution of Estate</h3>
                                    <p className="text-justify">
                                        I direct that the residue of my estate (after payment of debts and expenses) be distributed in accordance with the Islamic Law of Inheritance (Faraid) as prescribed in the Holy Quran (Surah An-Nisa).
                                    </p>
                                    <p className="mt-4 font-semibold">My legal heirs at the time of this writing are:</p>
                                    <ul className="grid grid-cols-2 gap-2 mt-2">
                                        {heirs.map(heir => (
                                            <li key={heir.id} className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                {heir.name} ({heir.relation.replace('_', ' ')})
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                        <div className="flex justify-between mt-16 print:mt-32">
                                            <div className="text-center">
                                                <div className="w-64 border-t border-black mb-2"></div>
                                                <p>Signature of Testator</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-48 border-t border-black mb-2"></div>
                                                <p>Date</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-16 print:mt-32">
                                            <div className="text-center">
                                                <div className="w-64 border-t border-black mb-2"></div>
                                                <p>Witness 1</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="w-64 border-t border-black mb-2"></div>
                                                <p>Witness 2</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end gap-4 print:hidden">
                                <button
                                    onClick={handlePrint}
                                    className="px-6 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#0f2744] font-medium flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Will
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Placeholders for other document types */}
            {activeModal && activeModal !== 'will' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {documentTypes.find(d => d.type === activeModal)?.label}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            This document template is coming soon.
                        </p>
                        <button
                            onClick={() => setActiveModal(null)}
                            className="px-6 py-2 bg-[#1a365d] text-white rounded-lg hover:bg-[#0f2744]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentGenerator;
