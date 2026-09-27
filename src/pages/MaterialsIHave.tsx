import React, { useState } from 'react';
import { Layers, Search, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useUser } from '../context/UserContext';

interface MaterialsIHaveProps {
  onNavigate: (page: string, params?: any) => void;
}

const MATERIAL_OPTIONS = [
  { id: 'Plastic', label: 'Plastic', desc: 'Bottles, caps, jugs, tubs, containers', color: 'bg-[#E0F4F2]', activeColor: 'bg-[#70C1B3]' },
  { id: 'Paper-Cardboard', label: 'Paper & Cardboard', desc: 'Shipping boxes, tubes, egg cartons, magazines', color: 'bg-[#F9EDE7]', activeColor: 'bg-[#C97C5D]' },
  { id: 'Fabric', label: 'Fabric & Textiles', desc: 'Torn jeans, old t-shirts, flannel, canvas sheets', color: 'bg-[#EBF0E4]', activeColor: 'bg-[#8A9A5B]' },
  { id: 'Glass', label: 'Glass & Ceramic', desc: 'Jars, broken mugs, bottles, chipped tiles', color: 'bg-[#FFF6E0]', activeColor: 'bg-[#FFD166]' },
  { id: 'E-waste', label: 'E-waste & Electronics', desc: 'Old circuit boards, broken cables, dead motherboards', color: 'bg-[#F4EDF8]', activeColor: 'bg-[#CDB4DB]' },
  { id: 'Metal', label: 'Metal & Tin Cans', desc: 'Soup tins, aluminum cans, bottle caps, wire', color: 'bg-[#EDF4FF]', activeColor: 'bg-[#A0C4FF]' },
];

export const MaterialsIHave: React.FC<MaterialsIHaveProps> = ({ onNavigate }) => {
  const { user, setMaterialsIHave } = useUser();
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    user?.materialsIHave || ['Plastic', 'Fabric']
  );

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      setMaterialsIHave(next);
      return next;
    });
  };

  const handleSelectAll = () => {
    const all = MATERIAL_OPTIONS.map((m) => m.id);
    setSelectedMaterials(all);
    setMaterialsIHave(all);
  };

  const handleClear = () => {
    setSelectedMaterials([]);
    setMaterialsIHave([]);
  };

  const handleFindIdeas = () => {
    onNavigate('explore', { initialMaterials: selectedMaterials });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-secondary)] text-white text-xs font-black rounded-lg uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Section 5 • Inverse Search</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-text-accent-dark)] tracking-tight">
          MATERIALS I HAVE IN STASH
        </h1>
        <p className="text-sm sm:text-base font-bold text-[var(--color-text-accent-dark)]/75 mt-1 max-w-2xl">
          Don't have a camera ready? Simply pick the recyclables you've collected at home. We'll filter the ranked craft library to only show projects feasible with your current stash.
        </p>
      </div>

      {/* Top action helper */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs font-black text-[var(--color-primary)] hover:underline cursor-pointer"
          >
            Select All
          </button>
          <span className="text-xs text-[var(--color-text-accent-dark)]/40">•</span>
          <button
            onClick={handleClear}
            className="text-xs font-black text-[var(--color-secondary)] hover:underline cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <span className="text-xs font-black bg-white px-3 py-1 rounded-xl border border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          {selectedMaterials.length} of {MATERIAL_OPTIONS.length} Selected
        </span>
      </div>

      {/* Material Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {MATERIAL_OPTIONS.map((item) => {
          const isSelected = selectedMaterials.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleMaterial(item.id)}
              className={`p-6 rounded-3xl border-[2.5px] border-[var(--color-text-accent-dark)] cursor-pointer select-none transition-all ${
                isSelected
                  ? `${item.activeColor} shadow-[5px_5px_0px_var(--color-text-accent-dark)] -translate-y-1`
                  : `${item.color} shadow-[3px_3px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5`
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-black text-[var(--color-text-accent-dark)]">
                  {item.label}
                </span>
                <div
                  className={`w-6 h-6 rounded-lg border-[2px] border-[var(--color-text-accent-dark)] flex items-center justify-center ${
                    isSelected ? 'bg-white text-black' : 'bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/80 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button */}
      <div className="sticky bottom-6 z-30 p-4 bg-white/90 backdrop-blur-md rounded-2xl border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-base text-[var(--color-text-accent-dark)]">
            Ready to find matching upcycles?
          </h4>
          <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
            {selectedMaterials.length === 0
              ? 'Select at least 1 material above'
              : `Found matching builds for: ${selectedMaterials.join(', ')}`}
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={selectedMaterials.length === 0}
          onClick={handleFindIdeas}
          icon={<Search className="w-5 h-5 stroke-[2.5]" />}
        >
          Find Ideas ({selectedMaterials.length} Selected)
        </Button>
      </div>
    </div>
  );
};
