import React, { useState } from 'react';
import { Document, Heir, Asset } from '../types';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import WillGenerator from './WillGenerator';

interface DocumentVaultProps {
  heirs?: Heir[];
  activeAssets?: Asset[];
}

const DocumentVault: React.FC<DocumentVaultProps> = ({ heirs = [], activeAssets = [] }) => {
  const { documents, addDocument, deleteDocument } = useData();
  const { user } = useAuth();

  const [filter, setFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', type: 'other' as Document['type'] });

  const filteredDocs = filter === 'all'
    ? documents
    : documents.filter(d => d.type === filter);

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'will':
        return (
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'deed':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'contract':
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getTypeBadgeColor = (type: Document['type']) => {
    const colors: Record<string, string> = {
      will: 'bg-purple-100 text-purple-700',
      deed: 'bg-blue-100 text-blue-700',
      certificate: 'bg-amber-100 text-amber-700',
      contract: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || colors.other;
  };

  const handleUpload = () => {
    if (newDoc.name) {
      addDocument({
        name: newDoc.name,
        type: newDoc.type,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      });
      setNewDoc({ name: '', type: 'other' });
      setShowUploadModal(false);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  return (
    <section id="documents" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1a365d] mb-2">
              Document Vault
            </h2>
            <p className="text-gray-600">
              Secure storage for wills, property deeds, and legal documents.
            </p>
          </div>
          {user && (
            <div className="flex flex-wrap gap-3">
              <WillGenerator heirs={heirs} activeAssets={activeAssets} />
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-2 bg-[#1a365d] hover:bg-[#0f2744] text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Document
              </button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'will', 'deed', 'certificate', 'contract', 'other'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === type
                ? 'bg-[#1a365d] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {type !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({documents.filter(d => d.type === type).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#d4af37]/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                {getTypeIcon(doc.type)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(doc.type)}`}>
                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1a365d] transition-colors">
                {doc.name}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                <span>{doc.fileSize}</span>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                {/* Delete Button (Only for authenticated users) */}
                {user ? (
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                    title="Delete Document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                ) : (
                  <button className="flex-1 px-3 py-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#d4af37] text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">Upload documents to get started</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none"
                    placeholder="Enter document name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={newDoc.type}
                    onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as Document['type'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#d4af37] focus:border-transparent outline-none bg-white"
                  >
                    <option value="will">Will</option>
                    <option value="deed">Property Deed</option>
                    <option value="certificate">Certificate</option>
                    <option value="contract">Contract</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#d4af37] transition-colors cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-1">PDF, DOC, or image files</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!newDoc.name}
                  className="flex-1 px-4 py-3 bg-[#1a365d] hover:bg-[#0f2744] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentVault;
