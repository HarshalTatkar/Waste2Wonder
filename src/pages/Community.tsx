import React, { useState, useEffect, useCallback } from 'react';
import { PostCard } from '../components/community/PostCard';
import { CommentSection } from '../components/community/CommentSection';
import { Modal } from '../components/common/Modal';
import { UploadResultModal } from '../components/craft-detail/UploadResultModal';
import { ImplementationProcessModal, ProcessModalCraft } from '../components/common/ImplementationProcessModal';
import { FindMakersModal } from '../components/community/FindMakersModal';
import { postService } from '../services/postService';
import { Post } from '../types/post';
import { useUser } from '../context/UserContext';
import { Users, PlusCircle, Search } from 'lucide-react';

interface CommunityProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Community: React.FC<CommunityProps> = ({ onNavigate }) => {
  const { user, addImplementedCraft } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // States for process guide modal and work attachment modal
  const [processPost, setProcessPost] = useState<Post | null>(null);
  const [uploadPost, setUploadPost] = useState<Post | null>(null);
  const [showFindMakers, setShowFindMakers] = useState(false);

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

  const handleLike = async (postId: string): Promise<{ likes: number; liked: boolean } | void> => {
    if (!user) return;
    return postService.likePost(postId, user.id);
  };

  // Fetch fresh comments from DB every time the modal opens
  const openComments = useCallback(async (post: Post) => {
    setActiveCommentsPost(post);
    setCommentsLoading(true);
    try {
      const fresh = await postService.getPostById(post.id);
      if (fresh) setActiveCommentsPost(fresh);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  const handleAddComment = async (text: string) => {
    if (!activeCommentsPost || !user) return;
    const newComment = await postService.addComment(activeCommentsPost.id, text, user.id);
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

  // User clicked "Try It" on a post -> open ImplementationProcessModal
  const handleTryItClick = (post: Post) => {
    setProcessPost(post);
  };

  // From ImplementationProcessModal, user clicks "I Built This! Attach Work"
  const handleProceedToAttachWork = () => {
    if (processPost) {
      setUploadPost(processPost);
      setProcessPost(null);
    }
  };

  const handleTryItSubmit = async (data: {
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote: string;
  }) => {
    if (!uploadPost) return;
    await addImplementedCraft({
      originalReferenceTitle: uploadPost.title,
      originalReferenceSource: 'in_app',
      originalReferenceId: uploadPost.id,
      implementedCraftTitle: data.implementedCraftTitle,
      uploadedResultPhoto: data.uploadedResultPhoto,
      feedbackNote: data.feedbackNote,
      creatorName: uploadPost.author.name,
    });
    setUploadPost(null);
    await loadPosts();
  };

  const getCraftDataFromPost = (post: Post): ProcessModalCraft => {
    return {
      title: post.title,
      material: post.materials[0] || 'Mixed Materials',
      difficulty: post.difficulty,
      timeRequired: post.timeTaken,
      estimatedCost: post.cost,
      description: post.description,
      creatorName: post.author.name,
      materialsNeeded: post.materials,
      steps: post.steps.length > 0 ? post.steps : [
        { stepNumber: 1, title: 'Follow the creator\'s guide', instructions: post.description || 'See post description for instructions.' },
      ],
      precautions: post.precautions.length > 0 ? post.precautions : ['Follow safe crafting practices.'],
    };
  };

  const handleDeletePost = async (post: Post) => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) return;
    try {
      if (user) {
        await postService.deletePost(post.id, user.id);
        setPosts(prev => prev.filter(p => p.id !== post.id));
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Community Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b-[2px] border-black/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-[2px] border-black rounded-full text-xs font-black shadow-[2px_2px_0px_#000] uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Maker Community Feed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
            UPCYCLE DISCUSSIONS & BUILDS
          </h1>
          <p className="text-sm sm:text-base font-bold text-black/75 mt-1">
            Real upcyclers showcasing before/after transformations and step breakdowns.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowFindMakers(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border-[2.5px] border-black bg-white text-black font-black text-xs shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Find Makers</span>
          </button>
          
          <button
            onClick={() => onNavigate('create-post')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border-[2.5px] border-black bg-[#FDA4AF] text-black font-black text-xs shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Post Your Craft</span>
          </button>
        </div>
      </div>

      {/* Feed list */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onOpenComments={openComments}
            onTryIt={handleTryItClick}
            onDelete={user?.username === post.author.username ? handleDeletePost : undefined}
            onNavigate={onNavigate}
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

      {/* Implementation Process Guide Modal */}
      {processPost && (
        <ImplementationProcessModal
          isOpen={Boolean(processPost)}
          onClose={() => setProcessPost(null)}
          craft={getCraftDataFromPost(processPost)}
          onProceedToAttachWork={handleProceedToAttachWork}
        />
      )}

      {/* Upload Result Modal with File Picker */}
      {uploadPost && (
        <UploadResultModal
          isOpen={Boolean(uploadPost)}
          onClose={() => setUploadPost(null)}
          craftTitle={uploadPost.title}
          referenceSource="in_app"
          referenceId={uploadPost.id}
          creatorName={uploadPost.author.name}
          onSubmitResult={handleTryItSubmit}
        />
      )}

      {/* Find Makers Search Modal */}
      <FindMakersModal
        isOpen={showFindMakers}
        onClose={() => setShowFindMakers(false)}
        onNavigateToProfile={(userId) => onNavigate('profile', { userId })}
      />
    </div>
  );
};
