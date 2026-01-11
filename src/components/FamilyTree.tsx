import React, { useState } from 'react';
import { Heir } from '../types';
import { getRelationLabel } from '../utils/inheritance';
import { getRelationColor } from '../data/family';
import { useAuth } from '@/contexts/AuthContext';
import AddHeirModal from './AddHeirModal';

interface FamilyTreeProps {
  heirs: Heir[];
  onSelectHeir: (heir: Heir) => void;
}

import PrintButton from './PrintButton';

const FamilyTree: React.FC<FamilyTreeProps> = ({ heirs = [], onSelectHeir }) => {
  const { user } = useAuth();
  const [showAddHeir, setShowAddHeir] = useState(false);

  // Group heirs by generation/category
  const parents = heirs.filter(h => h.relation === 'father' || h.relation === 'mother');
  const spouses = heirs.filter(h => h.relation === 'spouse_wife' || h.relation === 'spouse_husband');
  const children = heirs.filter(h => h.relation === 'son' || h.relation === 'daughter');
  const siblings = heirs.filter(h => h.relation === 'brother' || h.relation === 'sister');
  const grandparents = heirs.filter(h => h.relation === 'grandfather' || h.relation === 'grandmother');

  const HeirCard: React.FC<{ heir: Heir }> = ({ heir }) => (
    <div
      onClick={() => onSelectHeir(heir)}
      className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#d4af37]/30"
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={heir.avatar}
            alt={heir.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-[#d4af37] transition-all"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate group-hover:text-[#1a365d]">
            {heir.name}
          </h4>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getRelationColor(heir.relation)}`}>
            {getRelationLabel(heir.relation)}
          </span>
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#d4af37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );

  const HeirSection: React.FC<{ title: string; icon: React.ReactNode; members: Heir[] }> = ({ title, icon, members }) => {
    if (members.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#1a365d]/10 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-[#1a365d]">{title}</h3>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm text-gray-600">
            {members.length}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(heir => (
            <HeirCard key={heir.id} heir={heir} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="family" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <PrintButton title="Print Family Tree" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a365d] mb-4">
            Family Heirs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            View all family members eligible for Islamic inheritance distribution according to Shariah law.
          </p>
          {user && (
            <button
              onClick={() => setShowAddHeir(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] text-[#1a365d] rounded-xl font-semibold hover:bg-[#c9a432] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Family Member
            </button>
          )}
        </div>

        {/* Family Tree Visualization */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100">
          {/* Grandparents */}
          <HeirSection
            title="Grandparents"
            icon={
              <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            members={grandparents}
          />

          {/* Parents */}
          <HeirSection
            title="Parents"
            icon={
              <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            members={parents}
          />

          {/* Spouse */}
          <HeirSection
            title="Spouse"
            icon={
              <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            members={spouses}
          />

          {/* Children */}
          <HeirSection
            title="Children"
            icon={
              <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            members={children}
          />

          {/* Siblings */}
          <HeirSection
            title="Siblings"
            icon={
              <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            members={siblings}
          />

          {/* Islamic Inheritance Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-[#1a365d] to-[#0f2744] rounded-2xl text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#d4af37]/20 rounded-xl">
                <svg className="w-8 h-8 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-[#d4af37] mb-2">Islamic Inheritance (Faraid)</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Inheritance shares are calculated according to Quranic principles. Sons receive twice the share of daughters.
                  Spouses, parents, and other relatives receive fixed shares (Dhawu al-Furud) before the remainder is distributed
                  to residuary heirs (Asabah).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddHeir && <AddHeirModal onClose={() => setShowAddHeir(false)} />}
    </section>
  );
};

export default FamilyTree;
