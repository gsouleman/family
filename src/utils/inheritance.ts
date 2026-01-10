import { Heir, HeirRelation, InheritanceShare } from '../types';

// Islamic Inheritance (Faraid) Calculator
// Based on Quranic verses and Hadith

interface FaraidConfig {
  hasChildren: boolean;
  hasSons: boolean;
  hasDaughters: boolean;
  hasSpouse: boolean;
  spouseGender: 'male' | 'female' | null;
  hasFather: boolean;
  hasMother: boolean;
  hasSiblings: boolean;
}

function analyzeHeirs(heirs: Heir[]): FaraidConfig {
  const relations = heirs.map(h => h.relation);
  
  return {
    hasChildren: relations.some(r => r === 'son' || r === 'daughter'),
    hasSons: relations.some(r => r === 'son'),
    hasDaughters: relations.some(r => r === 'daughter'),
    hasSpouse: relations.some(r => r === 'spouse_wife' || r === 'spouse_husband'),
    spouseGender: relations.includes('spouse_wife') ? 'female' : relations.includes('spouse_husband') ? 'male' : null,
    hasFather: relations.includes('father'),
    hasMother: relations.includes('mother'),
    hasSiblings: relations.some(r => r === 'brother' || r === 'sister'),
  };
}

function getRelationLabel(relation: HeirRelation): string {
  const labels: Record<HeirRelation, string> = {
    spouse_wife: 'Wife',
    spouse_husband: 'Husband',
    son: 'Son',
    daughter: 'Daughter',
    father: 'Father',
    mother: 'Mother',
    brother: 'Brother',
    sister: 'Sister',
    grandfather: 'Grandfather',
    grandmother: 'Grandmother',
  };
  return labels[relation];
}

export function calculateIslamicInheritance(
  heirs: Heir[],
  totalAmount: number
): InheritanceShare[] {
  if (heirs.length === 0) return [];

  const config = analyzeHeirs(heirs);
  const shares: InheritanceShare[] = [];
  let remainingShare = 1; // 100%

  // Step 1: Calculate fixed shares (Dhawu al-Furud)
  
  // Spouse share
  const spouses = heirs.filter(h => h.relation === 'spouse_wife' || h.relation === 'spouse_husband');
  spouses.forEach(spouse => {
    let spouseShare = 0;
    let fraction = '';
    
    if (spouse.relation === 'spouse_wife') {
      // Wife gets 1/8 if children exist, 1/4 if no children
      spouseShare = config.hasChildren ? 1/8 : 1/4;
      fraction = config.hasChildren ? '1/8' : '1/4';
    } else {
      // Husband gets 1/4 if children exist, 1/2 if no children
      spouseShare = config.hasChildren ? 1/4 : 1/2;
      fraction = config.hasChildren ? '1/4' : '1/2';
    }
    
    shares.push({
      heirId: spouse.id,
      heirName: spouse.name,
      relation: spouse.relation,
      sharePercentage: spouseShare * 100,
      shareAmount: totalAmount * spouseShare,
      shareFraction: fraction,
    });
    remainingShare -= spouseShare;
  });

  // Father's share
  const father = heirs.find(h => h.relation === 'father');
  if (father) {
    let fatherShare = 0;
    let fraction = '';
    
    if (config.hasSons) {
      // Father gets 1/6 if there are sons
      fatherShare = 1/6;
      fraction = '1/6';
    } else if (config.hasDaughters) {
      // Father gets 1/6 + residue if only daughters
      fatherShare = 1/6;
      fraction = '1/6 + Residue';
    } else {
      // Father gets residue if no children
      fatherShare = remainingShare;
      fraction = 'Residue';
    }
    
    if (fatherShare > 0 && fatherShare <= remainingShare) {
      shares.push({
        heirId: father.id,
        heirName: father.name,
        relation: father.relation,
        sharePercentage: fatherShare * 100,
        shareAmount: totalAmount * fatherShare,
        shareFraction: fraction,
      });
      if (fraction === '1/6' || fraction === '1/6 + Residue') {
        remainingShare -= 1/6;
      } else {
        remainingShare = 0;
      }
    }
  }

  // Mother's share
  const mother = heirs.find(h => h.relation === 'mother');
  if (mother) {
    let motherShare = 0;
    let fraction = '';
    
    if (config.hasChildren || (config.hasSiblings && heirs.filter(h => h.relation === 'brother' || h.relation === 'sister').length >= 2)) {
      // Mother gets 1/6 if children or 2+ siblings
      motherShare = 1/6;
      fraction = '1/6';
    } else {
      // Mother gets 1/3 if no children and less than 2 siblings
      motherShare = 1/3;
      fraction = '1/3';
    }
    
    if (motherShare <= remainingShare) {
      shares.push({
        heirId: mother.id,
        heirName: mother.name,
        relation: mother.relation,
        sharePercentage: motherShare * 100,
        shareAmount: totalAmount * motherShare,
        shareFraction: fraction,
      });
      remainingShare -= motherShare;
    }
  }

  // Step 2: Calculate children's shares (Asabah - Residuary)
  const sons = heirs.filter(h => h.relation === 'son');
  const daughters = heirs.filter(h => h.relation === 'daughter');

  if (sons.length > 0 || daughters.length > 0) {
    // Sons and daughters share the remainder
    // Sons get 2x daughters' share
    const totalParts = (sons.length * 2) + daughters.length;
    const partValue = remainingShare / totalParts;

    sons.forEach(son => {
      const sonShare = partValue * 2;
      shares.push({
        heirId: son.id,
        heirName: son.name,
        relation: son.relation,
        sharePercentage: sonShare * 100,
        shareAmount: totalAmount * sonShare,
        shareFraction: `2/${totalParts} of Residue`,
      });
    });

    daughters.forEach(daughter => {
      const daughterShare = partValue;
      shares.push({
        heirId: daughter.id,
        heirName: daughter.name,
        relation: daughter.relation,
        sharePercentage: daughterShare * 100,
        shareAmount: totalAmount * daughterShare,
        shareFraction: `1/${totalParts} of Residue`,
      });
    });

    remainingShare = 0;
  } else if (daughters.length > 0 && sons.length === 0) {
    // Only daughters, no sons
    if (daughters.length === 1) {
      // Single daughter gets 1/2
      const daughterShare = Math.min(1/2, remainingShare);
      shares.push({
        heirId: daughters[0].id,
        heirName: daughters[0].name,
        relation: daughters[0].relation,
        sharePercentage: daughterShare * 100,
        shareAmount: totalAmount * daughterShare,
        shareFraction: '1/2',
      });
      remainingShare -= daughterShare;
    } else {
      // Multiple daughters share 2/3
      const totalDaughterShare = Math.min(2/3, remainingShare);
      const perDaughter = totalDaughterShare / daughters.length;
      
      daughters.forEach(daughter => {
        shares.push({
          heirId: daughter.id,
          heirName: daughter.name,
          relation: daughter.relation,
          sharePercentage: perDaughter * 100,
          shareAmount: totalAmount * perDaughter,
          shareFraction: `1/${daughters.length} of 2/3`,
        });
      });
      remainingShare -= totalDaughterShare;
    }
  }

  // Step 3: Siblings (if no children and no father)
  if (!config.hasChildren && !config.hasFather && remainingShare > 0) {
    const brothers = heirs.filter(h => h.relation === 'brother');
    const sisters = heirs.filter(h => h.relation === 'sister');

    if (brothers.length > 0 || sisters.length > 0) {
      const totalParts = (brothers.length * 2) + sisters.length;
      const partValue = remainingShare / totalParts;

      brothers.forEach(brother => {
        const brotherShare = partValue * 2;
        shares.push({
          heirId: brother.id,
          heirName: brother.name,
          relation: brother.relation,
          sharePercentage: brotherShare * 100,
          shareAmount: totalAmount * brotherShare,
          shareFraction: `2/${totalParts} of Residue`,
        });
      });

      sisters.forEach(sister => {
        const sisterShare = partValue;
        shares.push({
          heirId: sister.id,
          heirName: sister.name,
          relation: sister.relation,
          sharePercentage: sisterShare * 100,
          shareAmount: totalAmount * sisterShare,
          shareFraction: `1/${totalParts} of Residue`,
        });
      });

      remainingShare = 0;
    }
  }

  // If there's still remaining share and father exists (residue case)
  if (remainingShare > 0 && father) {
    const existingFatherShare = shares.find(s => s.heirId === father.id);
    if (existingFatherShare) {
      existingFatherShare.sharePercentage += remainingShare * 100;
      existingFatherShare.shareAmount += totalAmount * remainingShare;
    }
  }

  return shares;
}

// Legacy formatCurrency function - kept for backwards compatibility
// Components should use useCurrency().formatCurrency instead
export function formatCurrency(amount: number): string {
  // This is a fallback - components should use useCurrency hook
  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} FCFA`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export { getRelationLabel };
