import React, { useState } from 'react';
import { Plus, X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

interface MaterialsFormData {
  title: string;
  description: string;
  materials: string[];
  cost: string;
  timeTaken: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  precautions: string[];
  isContestEntry: boolean;
}

interface MaterialsFormProps {
  data: MaterialsFormData;
  onChange: (field: keyof MaterialsFormData, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MaterialsForm: React.FC<MaterialsFormProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const [newMaterial, setNewMaterial] = useState('');
  const [newPrecaution, setNewPrecaution] = useState('');

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMaterial.trim() && !data.materials.includes(newMaterial.trim())) {
      onChange('materials', [...data.materials, newMaterial.trim()]);
      setNewMaterial('');
    }
  };

  const handleRemoveMaterial = (item: string) => {
    onChange(
      'materials',
      data.materials.filter((m) => m !== item)
    );
  };

  const handleAddPrecaution = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrecaution.trim() && !data.precautions.includes(newPrecaution.trim())) {
      onChange('precautions', [...data.precautions, newPrecaution.trim()]);
      setNewPrecaution('');
    }
  };

  const handleRemovePrecaution = (item: string) => {
    onChange(
      'precautions',
      data.precautions.filter((p) => p !== item)
    );
  };

  const isFormValid =
    Boolean(data.title.trim()) &&
    Boolean(data.description.trim()) &&
    data.materials.length > 0 &&
    Boolean(data.cost.trim()) &&
    Boolean(data.timeTaken.trim());

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <span className="px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider">
          Steps 3 & 4
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-text-accent-dark)] mt-2">
          Materials, Cost & Auto-Determined Specs
        </h3>
        <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/70 mt-1">
          Manually enter what you used, while our AI automatically assesses the hazard grade and difficulty level (all fields fully editable).
        </p>
      </div>

      {/* Main Form Box */}
      <div className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Title & Description */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
            Upcycle Build Title *
          </label>
          <input
            type="text"
            required
            value={data.title}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="e.g. Minimalist Planter from 2-Liter Bottle"
            className="w-full px-4 py-2.5 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-sm focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
            Description & Inspiration *
          </label>
          <textarea
            rows={3}
            required
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Tell the community what inspired this creation and how you salvaged the base items..."
            className="w-full px-4 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-xs sm:text-sm focus:outline-none focus:bg-white resize-none"
          />
        </div>

        {/* Step 3: Manual Materials entry */}
        <div className="pt-4 border-t-[2px] border-[var(--color-text-accent-dark)]/20">
          <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-2">
            Step 3: Materials Used (Manual Entry) *
          </label>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {data.materials.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-background)] border-[2px] border-[var(--color-text-accent-dark)] rounded-lg text-xs font-black shadow-[1.5px_1.5px_0px_var(--color-text-accent-dark)]"
              >
                <span>{m}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(m)}
                  className="hover:text-[#FF6B6B] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              placeholder="e.g. 1 pair old jeans, PVA craft glue, acrylic paint..."
              className="flex-1 px-4 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] font-bold text-xs sm:text-sm focus:outline-none focus:bg-white"
            />
            <Button
              type="button"
              variant="cream"
              size="sm"
              onClick={handleAddMaterial}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Material
            </Button>
          </div>
        </div>

        {/* Step 3: Cost and Time Taken */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Estimated Out-of-Pocket Cost *
            </label>
            <input
              type="text"
              required
              value={data.cost}
              onChange={(e) => onChange('cost', e.target.value)}
              placeholder="e.g. $0.00 (Recycled) or $4.50"
              className="w-full px-4 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--color-text-accent-dark)] mb-1">
              Time Taken *
            </label>
            <input
              type="text"
              required
              value={data.timeTaken}
              onChange={(e) => onChange('timeTaken', e.target.value)}
              placeholder="e.g. 45 mins or 1.5 hours"
              className="w-full px-4 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] font-bold text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Step 4: Auto-Determined Specs (Shown Editable) */}
        <div className="pt-4 border-t-[2px] border-[var(--color-text-accent-dark)]/20 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />
            <h4 className="font-black text-sm uppercase tracking-wider text-[var(--color-text-accent-dark)]">
              Step 4: Auto-Determined Info (Editable)
            </h4>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-black text-[var(--color-text-accent-dark)] mb-1.5">
              Assessed Difficulty Level:
            </label>
            <div className="inline-flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChange('difficulty', lvl)}
                  className={`px-4 py-1.5 rounded-xl border-[2px] font-black text-xs transition-all cursor-pointer ${
                    data.difficulty === lvl
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]'
                      : 'bg-[var(--color-background)] border-[var(--color-text-accent-dark)] text-[var(--color-text-accent-dark)] hover:bg-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Precautions */}
          <div>
            <label className="block text-xs font-black text-[var(--color-text-accent-dark)] mb-1.5">
              Safety Precautions:
            </label>
            <div className="space-y-2 mb-2">
              {data.precautions.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-text-accent-dark)] text-xs font-bold"
                >
                  <span>⚠️ {p}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrecaution(p)}
                    className="hover:text-[#FF6B6B] cursor-pointer ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPrecaution}
                onChange={(e) => setNewPrecaution(e.target.value)}
                placeholder="Add custom precaution or safety advisory..."
                className="flex-1 px-4 py-2 bg-[var(--color-background)] rounded-xl border-[2px] border-[var(--color-text-accent-dark)] font-bold text-xs sm:text-sm"
              />
              <Button
                type="button"
                variant="cream"
                size="sm"
                onClick={handleAddPrecaution}
              >
                Add Precaution
              </Button>
            </div>
          </div>

          {/* Contest entry toggle */}
          <div className="p-3.5 rounded-xl bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] flex items-center justify-between">
            <div>
              <p className="font-black text-xs text-[var(--color-text-accent-dark)]">
                Submit this post to Week 38 Contest Challenge?
              </p>
              <p className="text-[10px] font-bold text-[var(--color-text-accent-dark)]/70">
                Qualifies for community spotlight, achievement ribbon, and rotating fair exposure
              </p>
            </div>
            <input
              type="checkbox"
              checked={data.isContestEntry}
              onChange={(e) => onChange('isContestEntry', e.target.checked)}
              className="w-5 h-5 accent-[var(--color-secondary)] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" size="md" onClick={onPrev} icon={<ArrowLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button
          variant="primary"
          size="md"
          disabled={!isFormValid}
          onClick={onNext}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Preview Upcycle Post
        </Button>
      </div>
    </div>
  );
};
