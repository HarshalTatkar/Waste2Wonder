import React, { useState } from 'react';
import { ImplementedWorkItem } from '../../types/user';
import { Post } from '../../types/post';
import { Heart, MessageCircle, Eye, CheckCircle2, ExternalLink, Calendar, Layers, Sparkles, Trash2 } from 'lucide-react';
import { formatCount } from '../../utils/formatters';

interface MyProjectsGridProps {
  implementedWork: ImplementedWorkItem[];
  createdPosts: Post[];
  onSelectOriginalReference?: (refId: string) => void;
  onSelectPost?: (post: Post) => void;
  onDeletePost?: (post: Post) => void;
}

export const MyProjectsGrid: React.FC<MyProjectsGridProps> = ({
  implementedWork,
  createdPosts,
  onSelectOriginalReference,
  onSelectPost,
  onDeletePost,
}) => {
  const [activeTab, setActiveTab] = useState<'implemented' | 'created'>('implemented');

  return (
    <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 mb-8">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('implemented')}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm border-[2px] transition-all cursor-pointer ${
              activeTab === 'implemented'
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
                : 'bg-[var(--color-background)] border-[var(--color-text-accent-dark)] text-[var(--color-text-accent-dark)] hover:bg-white'
            }`}
          >
            🌱 Implemented Work ({implementedWork.length})
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm border-[2px] transition-all cursor-pointer ${
              activeTab === 'created'
                ? 'bg-[var(--color-secondary)] text-white border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
                : 'bg-[var(--color-background)] border-[var(--color-text-accent-dark)] text-[var(--color-text-accent-dark)] hover:bg-white'
            }`}
          >
            🛠️ My Created Posts ({createdPosts.length})
          </button>
        </div>

        <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
          {activeTab === 'implemented'
            ? 'Completed crafts following community & AI guides'
            : 'Your published upcycling tutorials'}
        </span>
      </div>

      {/* Tab Content: Implemented Work */}
      {activeTab === 'implemented' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {implementedWork.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-background)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-text-accent-dark)] transition-all"
            >
              {/* Uploaded Result Photo */}
              <div className="relative aspect-video w-full overflow-hidden border-b-[2px] border-[var(--color-text-accent-dark)]">
                <img
                  src={item.uploadedResultPhoto}
                  alt={item.implementedCraftTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-lg border border-[var(--color-text-accent-dark)] text-[10px] font-black">
                  Result Upload
                </div>
                <div className="absolute top-2 right-2 bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-lg border border-[var(--color-text-accent-dark)] text-[10px] font-black uppercase">
                  {item.originalReferenceSource}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-base text-[var(--color-text-accent-dark)] mb-1 leading-snug">
                    {item.implementedCraftTitle}
                  </h4>

                  <div className="text-xs font-bold text-[var(--color-text-accent-dark)]/80 mb-2">
                    <span className="text-[var(--color-secondary)] font-black">Reference: </span>
                    {item.originalReferenceTitle}
                    {item.creatorName && <span> (by {item.creatorName})</span>}
                  </div>

                  {item.feedbackNote && (
                    <p className="text-xs italic text-[var(--color-text-accent-dark)]/70 bg-white/80 p-2.5 rounded-lg border border-[var(--color-text-accent-dark)]/20 mb-3">
                      "{item.feedbackNote}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-[var(--color-text-accent-dark)]/15 flex items-center justify-between text-[11px] font-black text-[var(--color-text-accent-dark)]/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  {onSelectOriginalReference && (
                    <button
                      onClick={() => onSelectOriginalReference(item.originalReferenceId)}
                      className="text-[var(--color-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View Ref</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: My Created Posts */}
      {activeTab === 'created' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {createdPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectPost?.(post)}
              className="bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-text-accent-dark)] transition-all cursor-pointer"
            >
              <div className="relative aspect-video w-full overflow-hidden border-b-[2px] border-[var(--color-text-accent-dark)]">
                <img
                  src={post.afterImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[var(--color-secondary)] text-white text-[10px] font-black rounded-lg">
                  {post.difficulty}
                </span>

                {onDeletePost && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePost(post);
                      }}
                      className="p-1.5 bg-white border-[2px] border-[#FF6B6B] rounded-lg text-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B] hover:bg-[#FF6B6B]/10 active:translate-y-0.5 active:shadow-[0px_0px_0px_#FF6B6B] transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-base text-[var(--color-text-accent-dark)] line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/75 line-clamp-2 mb-3">
                    {post.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--color-text-accent-dark)]/15 flex items-center justify-between text-xs font-black text-[var(--color-text-accent-dark)]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#FF6B6B]" />
                      {formatCount(post.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      {post.comments?.length || 0}
                    </span>
                  </div>

                  <span className="text-[var(--color-primary)]">
                    {post.implementationsCount} Implementations
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
