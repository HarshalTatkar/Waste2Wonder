import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/community/PostCard';
import { CommentSection } from '../components/community/CommentSection';
import { Modal } from '../components/common/Modal';
import { UploadResultModal } from '../components/craft-detail/UploadResultModal';
import { Button } from '../components/common/Button';
import { postService } from '../services/postService';
import { Post } from '../types/post';
import { useUser } from '../context/UserContext';
import { Users, PlusCircle, Sparkles, Filter } from 'lucide-react';

interface CommunityProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Community: React.FC<CommunityProps> = ({ onNavigate }) => {
  const { user, addImplementedCraft } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [tryItPost, setTryItPost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    await postService.likePost(postId);
  };

  const handleAddComment = async (text: string) => {
    if (!activeCommentsPost || !user) return;
    const newComment = await postService.addComment(activeCommentsPost.id, text, {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
    });
    setActiveCommentsPost({
      ...activeCommentsPost,
      comments: [newComment, ...activeCommentsPost.comments],
    });
    // Update main list
    setPosts((prev) =>
      prev.map((p) =>
        p.id === activeCommentsPost.id
          ? { ...p, comments: [newComment, ...p.comments] }
          : p
      )
    );
  };

  const handleTryItSubmit = async (data: {
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote: string;
  }) => {
    if (!tryItPost) return;
    await addImplementedCraft({
      originalReferenceTitle: tryItPost.title,
      originalReferenceSource: 'in_app',
      originalReferenceId: tryItPost.id,
      implementedCraftTitle: data.implementedCraftTitle,
      uploadedResultPhoto: data.uploadedResultPhoto,
      feedbackNote: data.feedbackNote,
      creatorName: tryItPost.author.name,
    });
    await loadPosts();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Community Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-black rounded-lg uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Maker Community Feed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-text-accent-dark)] tracking-tight">
            UPCYCLE DISCUSSIONS & BUILDS
          </h1>
          <p className="text-sm sm:text-base font-bold text-[var(--color-text-accent-dark)]/75 mt-1">
            Real upcyclers showcasing before/after transformations and step breakdowns.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => onNavigate('create-post')}
          icon={<PlusCircle className="w-5 h-5" />}
        >
          + Post Your Craft
        </Button>
      </div>

      {/* Feed list */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onOpenComments={(p) => setActiveCommentsPost(p)}
            onTryIt={(p) => setTryItPost(p)}
          />
        ))}
      </div>

      {/* Comment Section Modal */}
      {activeCommentsPost && (
        <Modal
          isOpen={Boolean(activeCommentsPost)}
          onClose={() => setActiveCommentsPost(null)}
          title={`Comments on "${activeCommentsPost.title}"`}
          maxWidth="lg"
        >
          <CommentSection
            comments={activeCommentsPost.comments || []}
            onAddComment={handleAddComment}
            currentUserAvatar={user?.avatar}
            currentUserName={user?.name}
          />
        </Modal>
      )}

      {/* Try It Modal (Section 1/2 behavior: links to post, increments post count) */}
      {tryItPost && (
        <UploadResultModal
          isOpen={Boolean(tryItPost)}
          onClose={() => setTryItPost(null)}
          craftTitle={tryItPost.title}
          referenceSource="in_app"
          referenceId={tryItPost.id}
          creatorName={tryItPost.author.name}
          onSubmitResult={handleTryItSubmit}
        />
      )}
    </div>
  );
};
