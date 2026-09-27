import React from 'react';
import { AchievementBadge, ContestMilestone } from '../../types/user';
import { Award, Trophy, Sparkles } from 'lucide-react';

interface AchievementsBadgesProps {
  achievements: AchievementBadge[];
  milestones: ContestMilestone[];
}

export const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({
  achievements,
  milestones,
}) => {
  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 mb-8">
      {/* Badges Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[var(--color-primary)] stroke-[2.5]" />
          <h3 className="text-xl font-black text-[var(--color-text-accent-dark)]">
            Achievements & Badges ({achievements.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-[var(--color-background)] border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-2xl p-4 flex flex-col items-center text-center hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_var(--color-text-accent-dark)] transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] flex items-center justify-center text-2xl mb-2">
                {ach.icon}
              </div>
              <h4 className="font-black text-sm text-[var(--color-text-accent-dark)] leading-tight">
                {ach.title}
              </h4>
              <p className="text-[11px] font-bold text-[var(--color-text-accent-dark)]/70 mt-1 line-clamp-2">
                {ach.description}
              </p>
              <span className="mt-2 text-[10px] font-black uppercase text-[var(--color-primary)]">
                Unlocked {ach.unlockedAt}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Contest Milestones */}
      {milestones && milestones.length > 0 && (
        <div className="pt-6 border-t-[2px] border-[var(--color-text-accent-dark)]/20">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-[#FFD166] stroke-[2.5]" />
            <h3 className="text-xl font-black text-[var(--color-text-accent-dark)]">
              Weekly Contest Milestones & Wins
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((ms, idx) => (
              <div
                key={idx}
                className="bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-secondary)]">
                    Round Week {ms.week}
                  </span>
                  <h4 className="font-black text-sm text-[var(--color-text-accent-dark)] mt-0.5">
                    {ms.achievement}
                  </h4>
                </div>
                <span className="px-3 py-1 bg-white border-[1.5px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] rounded-xl text-xs font-black text-[var(--color-text-accent-dark)] shrink-0">
                  {ms.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
