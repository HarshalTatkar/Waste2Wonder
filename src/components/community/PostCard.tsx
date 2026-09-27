import React, { useState } from 'react';
import { Post } from '../../types/post';
import { Heart, MessageCircle, Eye, CheckCircle2, Clock, DollarSign, AlertCircle, Share2, Layers } from 'lucide-react';
import { formatCount, getDifficultyColor } from '../../utils/formatters';
import { Button } from '../common/Button';
import confetti from 'canvas-confetti';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onTryIt: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onOpenComments,
  onTryIt,
}) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [viewMode, setViewMode] = useState<'after' | 'before' | 'process'>('after');
  const diff = getDifficultyColor(post.difficulty);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      onLike(post.id);
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <article className="neu-card bg-white border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[5px_5px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-7 mb-8 transition-all hover:shadow-[7px_7px_0px_var(--color-text-accent-dark)]">
      {/* Post Author Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-xl object-cover border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-black text-base text-[var(--color-text-accent-dark)] leading-tight">
                {post.author.name}
              </h4>
              {post.author.role && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[var(--color-background)] border border-[var(--color-text-accent-dark)] rounded-md">
                  {post.author.role}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/60">
              @{post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Difficulty badge */}
        <span
          className={`px-3 py-1 rounded-xl border-[2px] ${diff.border} ${diff.bg} ${diff.text} text-xs font-black shadow-[2px_2px_0px_var(--color-text-accent-dark)]`}
        >
          {post.difficulty}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-accent-dark)] mb-2">
        {post.title}
      </h3>
      <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/80 mb-4 leading-relaxed">
        {post.description}
      </p>

      {/* Before / After / Process Media Viewer */}
      <div className="relative mb-5 rounded-2xl border-[2.5px] border-[var(--color-text-accent-dark)] overflow-hidden shadow-[4px_4px_0px_var(--color-text-accent-dark)] bg-black/5">
        <div className="aspect-video w-full">
          {viewMode === 'after' && (
            <img
              src={post.afterImage}
              alt={`${post.title} after`}
              className="w-full h-full object-cover animate-in fade-in"
            />
          )}
          {viewMode === 'before' && (
            <img
              src={post.beforeImage}
              alt={`${post.title} before`}
              className="w-full h-full object-cover animate-in fade-in"
            />
          )}
          {viewMode === 'process' && post.processImages && post.processImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-2 h-full bg-gray-50">
              {post.processImages.map((pImg, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-[var(--color-text-accent-dark)]">
                  <img src={pImg} alt={`Process ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-white/90 text-[9px] font-black px-1.5 py-0.5 rounded">
                    Step {idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Switcher Overlay Buttons */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
          <button
            onClick={() => setViewMode('after')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'after'
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-accent-dark)] hover:bg-black/5'
            }`}
          >
            ✨ After Upcycle
          </button>
          <button
            onClick={() => setViewMode('before')}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'before'
                ? 'bg-[var(--color-secondary)] text-white'
                : 'text-[var(--color-text-accent-dark)] hover:bg-black/5'
            }`}
          >
            🗑️ Before (Waste)
          </button>
          {post.processImages && post.processImages.length > 0 && (
            <button
              onClick={() => setViewMode('process')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                viewMode === 'process'
                  ? 'bg-[var(--color-text-accent-dark)] text-white'
                  : 'text-[var(--color-text-accent-dark)] hover:bg-black/5'
              }`}
            >
              📷 Process ({post.processImages.length})
            </button>
          )}
        </div>
      </div>

      {/* Materials & Stats Row */}
      <div className="p-4 bg-[var(--color-background)] rounded-2xl border-[2px] border-[var(--color-text-accent-dark)] mb-5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-4 text-xs font-black text-[var(--color-text-accent-dark)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
            Time: {post.timeTaken}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Cost: {post.cost}
          </span>
          <span className="flex items-center gap-1 text-[var(--color-primary)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {post.implementationsCount} Community Builds
          </span>
        </div>

        {/* Materials Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-black uppercase text-[var(--color-text-accent-dark)]/70 mr-1">
            Materials:
          </span>
          {post.materials.map((m, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-white border border-[var(--color-text-accent-dark)] rounded-md text-[11px] font-bold text-[var(--color-text-accent-dark)]"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t-[2px] border-[var(--color-text-accent-dark)]/20">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-[2px] font-black text-xs transition-all cursor-pointer ${
              hasLiked
                ? 'bg-[#FF6B6B] text-white border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)]'
                : 'bg-white border-[var(--color-text-accent-dark)] shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{formatCount(likes)}</span>
          </button>

          <button
            onClick={() => onOpenComments(post)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-[2px] border-[var(--color-text-accent-dark)] rounded-xl font-black text-xs shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{post.comments?.length || 0} Comments</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-accent-dark)]/60">
            <Eye className="w-3.5 h-3.5" />
            {formatCount(post.views)} views
          </span>
        </div>

        <button
          onClick={() => onTryIt(post)}
          className="px-4 py-2 rounded-full border-[2px] border-black bg-[#98EECC] text-black font-black text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Try It</span>
        </button>
      </div>
    </article>
  );
};
