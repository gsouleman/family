import React from 'react';

interface ErrorBannerProps {
    error: string | null;
    className?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, className = '' }) => {
    if (!error) return null;

    // Parse the error string from api.ts (format: "Msg | DETAILS: ... | DEBUG: ...")
    const parts = error.split('|').map(s => s.trim());
    const mainMsg = parts[0];
    const details = parts.find(p => p.startsWith('DETAILS:'))?.replace('DETAILS:', '').trim();
    const debug = parts.find(p => p.startsWith('DEBUG:'))?.replace('DEBUG:', '').trim();

    return (
        <div className={`p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-full shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-red-900 font-bold text-sm mb-1">Action Failed</h3>
                    <p className="text-red-700 text-sm font-medium">{mainMsg}</p>

                    {(details || debug) && (
                        <div className="mt-3 bg-white/50 rounded-lg p-3 text-xs font-mono border border-red-100 overflow-x-auto">
                            {details && (
                                <div className="mb-1">
                                    <span className="font-bold text-red-800">Error:</span>{' '}
                                    <span className="text-red-700">{details}</span>
                                </div>
                            )}
                            {debug && (
                                <div>
                                    <span className="font-bold text-red-800">Debug:</span>{' '}
                                    <span className="text-red-700">{debug}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-2 text-[10px] text-red-400">
                        {new Date().toLocaleTimeString()} • system error
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorBanner;
