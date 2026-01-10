import React, { useState } from 'react';
import { Heir, RelationType } from '../types';
import { calculateIslamicInheritance, formatCurrency, formatPercentage, getRelationLabel } from '../utils/inheritance';
import { getRelationColor } from '../data/family';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

interface HeirDetailModalProps {
  heir: Heir;
  allHeirs: Heir[];
  totalAssetValue: number;
  onClose: () => void;
}

const relations: { value: RelationType; label: string }[] = [
  { value: 'spouse_wife', label: 'Wife' },
  { value: 'spouse_husband', label: 'Husband' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'grandmother', label: 'Grandmother' },
];

const HeirDetailModal: React.FC<HeirDetailModalProps> = ({ heir, allHeirs, totalAssetValue, onClose }) => {
  const { user } = useAuth();
  const { updateHeir, deleteHeir } = useData();
  const shares = calculateIslamicInheritance(allHeirs, totalAssetValue);
  const heirShare = shares.find(s => s.heirId === heir.id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: heir.name,
    relation: heir.relation,
    dateOfBirth: heir.dateOfBirth || '',
    email: heir.email || '',
    phone: heir.phone || '',
  });

  const handleUpdate = () => {
    updateHeir(heir.id, {
      name: formData.name,
      relation: formData.relation,
      dateOfBirth: formData.dateOfBirth,
      email: formData.email,
      phone: formData.phone,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this family member?')) {
      deleteHeir(heir.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1a365d] to-[#0f2744] p-8 text-center shrink-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <img
              src={heir.avatar}
              alt={heir.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#d4af37]"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1a365d] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2 max-w-xs mx-auto">
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-center"
              />
              <select
                value={formData.relation}
                onChange={e => setFormData({ ...formData, relation: e.target.value as RelationType })}
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-center [&>option]:text-black"
              >
                {relations.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">{heir.name}</h2>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getRelationColor(heir.relation)}`}>
                {getRelationLabel(heir.relation)}
              </span>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Contact Form/Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                    placeholder="Optional"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{heir.email || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                    placeholder="Optional"
                  />
                ) : (
                  <p className="font-medium text-gray-900">{heir.phone || 'N/A'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Date of Birth</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  />
                ) : (
                  <p className="font-medium text-gray-900">
                    {heir.dateOfBirth ? new Date(heir.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Inheritance Share - Only show if authenticated */}
          {user ? (
            heirShare && (
              <div className="p-4 bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 rounded-xl border border-[#d4af37]/30">
                <h3 className="font-semibold text-[#1a365d] mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Projected Inheritance
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-[#d4af37]">{formatCurrency(heirShare.shareAmount)}</p>
                    <p className="text-xs text-gray-500 mt-1">Projected Amount</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-2xl font-bold text-[#1a365d]">{formatPercentage(heirShare.sharePercentage)}</p>
                    <p className="text-xs text-gray-500 mt-1">Share Percentage</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Islamic Share (Faraid)</span>
                    <span className="font-semibold text-[#1a365d]">{heirShare.shareFraction}</span>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="font-semibold text-gray-700 mb-1">Inheritance Details Locked</h3>
              <p className="text-sm text-gray-500">
                Sign in to view projected inheritance amounts and share percentages.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 px-6 py-3 bg-[#1a365d] text-white rounded-xl hover:bg-[#0f2744] transition-colors font-semibold"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium"
              >
                Close
              </button>
              {user && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-semibold"
                  >
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeirDetailModal;
