import React, { useState, useEffect } from 'react';
import { Heir, Asset, Document } from '../types';
import { useCurrency } from '@/contexts/CurrencyContext';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentGeneratorProps {
    heirs: Heir[];
    activeAssets: Asset[];
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ heirs, activeAssets }) => {
    const { formatCurrency } = useCurrency();
    const { branding } = useAuth();
    const [activeModal, setActiveModal] = useState<Document['type'] | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<{ id: string; title: string; amount: number; date: string; category: string; description?: string } | null>(null);
    const [ledgerData, setLedgerData] = useState<{ id: string; title: string; amount: number; date: string; category: string; description?: string }[]>([]);

    useEffect(() => {
        if (activeModal === 'will') {
            fetchLedgerData('CREDITOR');
        } else if (activeModal === 'creditor_certificate') {
            fetchLedgerData('CREDITOR');
        } else if (activeModal === 'debtor_certificate') {
            fetchLedgerData('DEBTOR');
        }
    }, [activeModal]);

    const fetchLedgerData = async (type: 'CREDITOR' | 'DEBTOR') => {
        try {
            const entries = await api.getLedgerEntries();
            const filtered = entries
                .filter(e => e.type === type)
                .map(e => ({
                    id: e.id,
                    title: e.title,
                    amount: e.amount,
                    date: e.date,
                    category: e.category,
                    description: e.description
                }));
            setLedgerData(filtered);
        } catch (error) {
            console.error('Failed to fetch ledger:', error);
        }
    };

    // Calculations
    const totalAssets = activeAssets.reduce((acc, curr) => acc + curr.value, 0);
    // For Will only (liabilities)
    const totalLiabilities = (activeModal === 'will' ? ledgerData : []).reduce((acc, curr) => acc + curr.amount, 0);
    const netEstate = totalAssets - totalLiabilities;

    const handlePrint = () => {
        window.print();
    };

    const documentTypes: { type: Document['type']; label: string }[] = [
        { type: 'will', label: 'Islamic Will' },
        { type: 'deed', label: 'Property Deed' },
        { type: 'creditor_certificate', label: 'Creditor Certificate' },
        { type: 'debtor_certificate', label: 'Debtor Certificate' },
        { type: 'contract', label: 'Contract' },
    ];

    const handleSelectType = (type: Document['type']) => {
        setActiveModal(type);
        setShowDropdown(false);
        setSelectedPerson(null); // Reset selection
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-6 py-2 bg-[#d4af37] text-primary font-semibold rounded-lg hover:bg-[#c9a432] transition-colors flex items-center gap-2"
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
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
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
                                <h2 className="text-2xl font-bold text-primary">Last Will and Testament</h2>
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
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
                                            {ledgerData.length > 0 ? (
                                                <ul className="list-disc ml-6">
                                                    {ledgerData.map(l => (
                                                        <li key={l.id}>{l.title} ({formatCurrency(l.amount)})</li>
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
                                    {ledgerData.length > 0 ? (
                                        <ul className="list-disc ml-6 mt-2">
                                            {ledgerData.map(l => (
                                                <li key={l.id}>
                                                    Amount of <strong>{formatCurrency(l.amount)}</strong> owed to <strong>{l.title}</strong>.
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
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium flex items-center gap-2"
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

            {/* Certificate Modal (Combined for Creditor/Debtor) */}
            {(activeModal === 'creditor_certificate' || activeModal === 'debtor_certificate') && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:static print:bg-white print:p-0">
                    {!selectedPerson ? (
                        /* SELECTION VIEW */
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center print:hidden">
                            <h3 className="text-xl font-bold text-primary mb-2">
                                Select {activeModal === 'creditor_certificate' ? 'Creditor' : 'Debtor'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Choose a person to generate the certificate for.
                            </p>
                            <div className="space-y-2 max-h-60 overflow-y-auto mb-6 text-left">
                                {ledgerData.length > 0 ? (
                                    ledgerData.map(person => (
                                        <button
                                            key={person.id}
                                            onClick={() => setSelectedPerson(person)}
                                            className="w-full p-3 rounded-xl border border-gray-200 hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all text-left flex justify-between items-center group"
                                        >
                                            <span className="font-semibold text-gray-900 group-hover:text-primary">{person.title}</span>
                                            <span className="text-sm font-bold text-[#d4af37]">{formatCurrency(person.amount)}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-4">No records found.</p>
                                )}
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="w-full px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        /* CERTIFICATE VIEW */
                        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:shadow-none print:w-full">
                            <div className="p-8 print:p-0">
                                {/* Header Buttons */}
                                <div className="flex justify-between items-start mb-8 print:hidden">
                                    <h2 className="text-2xl font-bold text-primary">Document Preview</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedPerson(null)}
                                            className="text-gray-500 hover:text-primary px-3 py-1 rounded hover:bg-gray-100 text-sm"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setActiveModal(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Certificate Content */}
                                <div className="border-[10px] border-double border-primary p-12 print:border-[10px] print:border-primary print:p-12 relative overflow-hidden bg-white">
                                    {/* Watermark / Background Decoration */}
                                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none flex items-center justify-center">
                                        <svg className="w-[500px] h-[500px]" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L1 21h22L12 2zm0 3.516L20.297 19H3.703L12 5.516z" />
                                        </svg>
                                    </div>

                                    <div className="text-center relative z-10">
                                        <div className="mb-4">
                                            <h1 className="text-4xl font-serif font-bold text-primary uppercase tracking-widest mb-1">
                                                Certificate
                                            </h1>
                                            <p className="text-[#d4af37] font-serif italic text-xl">
                                                of {activeModal === 'creditor_certificate' ? 'Indebtedness' : 'Receivable Credit'}
                                            </p>
                                        </div>

                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-8"></div>

                                        <div className="font-serif text-gray-800 space-y-8 max-w-2xl mx-auto">
                                            <p className="text-lg italic text-gray-500">This is to certify that</p>

                                            <h2 className="text-3xl font-bold text-primary border-b-2 border-gray-200 inline-block pb-2 px-8">
                                                {selectedPerson.title}
                                            </h2>

                                            <p className="text-lg leading-relaxed">
                                                {activeModal === 'creditor_certificate' ? (
                                                    <>
                                                        is a recognized <strong>Creditor</strong> of {branding}.
                                                        {branding} acknowledges a debt obligation in the amount of:
                                                    </>
                                                ) : (
                                                    <>
                                                        is a recognized <strong>Debtor</strong> to {branding}.
                                                        {branding} holds a receivable credit claim in the amount of:
                                                    </>
                                                )}
                                            </p>

                                            <div className="text-4xl font-bold text-[#d4af37] py-4">
                                                {formatCurrency(selectedPerson.amount)}
                                            </div>

                                            <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-100 text-sm mt-8">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-gray-500 block">Reference ID</span>
                                                        <span className="font-mono text-gray-900">{selectedPerson.id.slice(0, 8).toUpperCase()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block">Date of Entry</span>
                                                        <span className="text-gray-900">{new Date(selectedPerson.date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block">Category</span>
                                                        <span className="text-gray-900 capitalize">{selectedPerson.category.replace('_', ' ').toLowerCase()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 block">Description</span>
                                                        <span className="text-gray-900">{selectedPerson.description || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 italic mt-8">
                                                This certificate serves as an official record of the financial relationship documented in the Ledger.
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end mt-24">
                                            <div className="text-center w-64">
                                                <div className="border-b border-gray-400 pb-2 mb-2 font-dancing-script text-2xl text-primary">
                                                    {branding}
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <div className="h-16 mb-2"></div>
                                                <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
                                            </div>

                                            <div className="text-center w-64">
                                                <div className="border-b border-gray-400 pb-2 mb-2 h-10"></div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Recipient Signature</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex justify-end gap-4 print:hidden">
                                    <button
                                        onClick={handlePrint}
                                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        Print Certificate
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Placeholders for other document types */}
            {activeModal && activeModal !== 'will' && activeModal !== 'creditor_certificate' && activeModal !== 'debtor_certificate' && (
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
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
