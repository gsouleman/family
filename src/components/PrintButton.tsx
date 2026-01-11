import React from 'react';

interface PrintButtonProps {
    sectionId?: string; // ID of the section to print (if we want to specific print)
    title?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ sectionId, title = "Print Report" }) => {
    const handlePrint = () => {
        if (sectionId) {
            document.body.classList.add(`print-mode-${sectionId}`);
        }
        window.print();
        // The class removal happens immediately after print dialog opens (browsers block JS until closed)
        // or we can use onafterprint for safety, but typically the render happens before print.
        // For better safety with async print dialogs:
        const cleanup = () => {
            if (sectionId) {
                document.body.classList.remove(`print-mode-${sectionId}`);
            }
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        // Fallback for browsers that don't block or if events fail
        setTimeout(() => {
            if (sectionId) document.body.classList.remove(`print-mode-${sectionId}`);
        }, 5000);
    };

    return (
        <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium print:hidden"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {title}
        </button>
    );
};

export default PrintButton;
