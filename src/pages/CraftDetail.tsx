import React, { useState, useEffect } from 'react';
import { Project } from '../types/project';
import { ReferenceSourceTag } from '../components/craft-detail/ReferenceSourceTag';
import { InfoStatsRow } from '../components/craft-detail/InfoStatsRow';
import { MaterialsList } from '../components/craft-detail/MaterialsList';
import { StepList } from '../components/craft-detail/StepList';
import { PrecautionsBox } from '../components/craft-detail/PrecautionsBox';
import { GeneratedImageGallery } from '../components/craft-detail/GeneratedImageGallery';
import { EngagementBar } from '../components/craft-detail/EngagementBar';
import { UploadResultModal } from '../components/craft-detail/UploadResultModal';
import { CommentSection } from '../components/community/CommentSection';
import { Button } from '../components/common/Button';
import { ReportPostModal } from '../components/community/ReportPostModal';
import { useUser } from '../context/UserContext';
import { postService } from '../services/postService';
import { ArrowLeft, Sparkles, Trash2, Flag } from 'lucide-react';
import { Comment } from '../types/post';

interface CraftDetailProps {
  project: Project;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const CraftDetail: React.FC<CraftDetailProps> = ({
  project,
  onBack,
}) => {
  const { user, addImplementedCraft } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportPost, setReportPost] = useState<Project | null>(null);

  // Comments — loaded from DB for in-app posts, local-only for others
  const [comments, setComments] = useState<Comment[]>([]);
  const [implementations, setImplementations] = useState<any[]>([]);
  const isDbBacked = project.source === 'in_app' && project.id && !project.id.startsWith('ai-');

  // Fetch comments and implementations from DB on mount for in-app posts
  useEffect(() => {
    if (isDbBacked) {
      postService.getPostById(project.id).then((post) => {
        if (post) setComments(post.comments);
      }).catch(() => { /* ignore */ });

      postService.getPostImplementations(project.id).then((impls) => {
        setImplementations(impls);
      }).catch(() => { /* ignore */ });
    }
  }, [project.id, isDbBacked]);

  const isYouTube = project.source === 'youtube';
  const isInApp = project.source === 'in_app';
  const isAiGen = project.source === 'ai_generated';

  const handleUploadResultSubmit = async (data: {
    implementedCraftTitle: string;
    uploadedResultPhoto: string;
    feedbackNote: string;
  }) => {
    await addImplementedCraft({
      originalReferenceTitle: project.title,
      originalReferenceSource: project.source,
      originalReferenceId: project.id,
      implementedCraftTitle: data.implementedCraftTitle,
      uploadedResultPhoto: data.uploadedResultPhoto,
      feedbackNote: data.feedbackNote,
      creatorName: project.author?.name,
    });
  };

  const handleScrollToSteps = () => {
    const el = document.getElementById('step-list-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToComments = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = el.querySelector('input');
      if (input) input.focus();
    }
  };

  const handleAddComment = async (text: string) => {
    if (isDbBacked && user) {
      // Persist to database
      try {
        const newComment = await postService.addComment(project.id, text, user.id);
        setComments((prev) => [newComment, ...prev]);
      } catch {
        // Fallback to local-only on failure
        const localComment: Comment = {
          id: `comm-${Date.now()}`,
          author: user.name || 'You',
          avatar: user.avatar || '',
          text,
          date: 'Just now',
          likes: 0,
        };
        setComments((prev) => [localComment, ...prev]);
      }
    } else {
      // Non-DB project — local only
      const newComment: Comment = {
        id: `comm-${Date.now()}`,
        author: user?.name || 'You',
        avatar: user?.avatar || '',
        text,
        date: 'Just now',
        likes: 0,
      };
      setComments((prev) => [newComment, ...prev]);
    }
  };

  const handleDelete = async () => {
    if (!user || !project.author || user.username !== project.author.username) return;
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    try {
      if (isDbBacked) {
        // use project.id as the post ID and user.id to verify ownership
        await postService.deletePost(project.id, user.id);
      }
      onBack(); // Go back to feed after delete
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Browse
        </Button>

        <div className="flex items-center gap-2">
          {user && project.author && user.username === project.author.username && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 text-[#FF6B6B] text-xs font-black uppercase tracking-wider rounded-lg border-[2px] border-[#FF6B6B] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
          {user && project.author && user.username !== project.author.username && (
            <button
              onClick={() => setReportPost(project)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD93D]/10 hover:bg-[#FFD93D]/20 text-black text-xs font-black uppercase tracking-wider rounded-lg border-[2px] border-black transition-colors"
            >
              <Flag className="w-3.5 h-3.5" />
              Report
            </button>
          )}
          <ReferenceSourceTag
            source={project.source}
            authorName={project.author?.name}
          />
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight leading-tight uppercase">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg font-bold text-black/80 mt-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Media Showcase Branching by Source */}
      {isInApp && (
        <div className="relative aspect-video sm:aspect-21/9 rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_#000] overflow-hidden bg-gray-100 mb-6">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {project.author && (
            <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1.5 rounded-xl border-[2px] border-black shadow-[3px_3px_0px_#000] flex items-center gap-2">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-7 h-7 rounded-lg object-cover border border-black"
              />
              <span className="text-xs font-black">
                Created by {project.author.name}
              </span>
            </div>
          )}
        </div>
      )}

      {isYouTube && (
        <div className="mb-6 space-y-3">
          <div className="relative aspect-video rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_#000] overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${project.youtubeVideoId || 'dQw4w9WgXcQ'}`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {isAiGen && (
        <GeneratedImageGallery
          finalOutputImage={project.finalOutputImage || project.coverImage}
          inProgressImages={project.inProgressImages}
        />
      )}

      {/* Engagement Bar (Likes, Comments, Views, Implementation count, "Try It") */}
      <EngagementBar
        initialLikes={project.likes}
        commentsCount={comments.length}
        views={project.views}
        implementationsCount={project.implementationsCount}
        onTryIt={handleScrollToSteps}
        onCommentClick={handleScrollToComments}
      />

      {/* Key Project Specs Row */}
      <InfoStatsRow
        timeRequired={project.timeRequired}
        estimatedCost={project.estimatedCost}
        difficulty={project.difficulty}
        material={project.material}
        isAiGeneratedLabel={false}
      />

      {/* Precautions Warning Box */}
      <PrecautionsBox precautions={project.precautions} />

      {/* Materials Needed Checklist */}
      <MaterialsList materials={project.materialsNeeded} />

      {/* Step by Step List - with Anchor ID */}
      <div id="step-list-section" className="pt-2">
        <StepList steps={project.steps} isAiGenerated={isYouTube || isAiGen} />
      </div>

      {/* Bottom Action Bar: Upload Result Photo after finishing steps */}
      <div className="p-6 sm:p-8 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
        <div>
          <h3 className="font-black text-xl text-black">
            Did you build this project?
          </h3>
          <p className="text-xs sm:text-sm font-bold text-black/70">
            Upload your finished result photo to log your environmental impact and showcase your craft.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-full border-[2.5px] border-black bg-[#FFAAA6] text-black font-black text-sm shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-0.5 active:shadow-none flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Upload My Result Photo</span>
        </button>
      </div>

      {/* Implementations Section */}
      {isDbBacked && implementations.length > 0 && (
        <div className="mt-12 bg-white rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 sm:p-8">
          <h3 className="text-2xl font-black text-black mb-6 uppercase tracking-wider">
            Maker Implementations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {implementations.map((impl) => (
              <div key={impl.id} className="bg-[#FFFDF9] rounded-2xl border-[2px] border-black overflow-hidden flex flex-col group">
                <div className="aspect-video w-full border-b-[2px] border-black overflow-hidden relative bg-black/5">
                  <img src={impl.resultPhoto} alt={impl.craftTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h4 className="font-black text-sm text-black leading-tight line-clamp-1">{impl.craftTitle}</h4>
                  {impl.feedbackNote && (
                    <p className="text-xs font-bold text-black/70 line-clamp-2">{impl.feedbackNote}</p>
                  )}
                  <div className="mt-auto pt-3 flex items-center gap-2 border-t-[1.5px] border-black/10">
                    <img src={impl.creatorAvatar || 'https://via.placeholder.com/150'} alt={impl.creatorName} className="w-6 h-6 rounded-md object-cover border-[1.5px] border-black" />
                    <span className="text-[10px] font-black uppercase text-black/80 truncate">By {impl.creatorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fully Functional Interactive Comments Section */}
      <CommentSection
        comments={comments}
        onAddComment={handleAddComment}
        currentUserAvatar={user?.avatar}
        currentUserName={user?.name}
      />

      {/* Upload My Result Modal with Genuine File Uploading */}
      <UploadResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        craftTitle={project.title}
        referenceSource={project.source}
        referenceId={project.id}
        creatorName={project.author?.name}
        onSubmitResult={handleUploadResultSubmit}
      />

      {/* Report Post Modal */}
      <ReportPostModal
        isOpen={Boolean(reportPost)}
        onClose={() => setReportPost(null)}
        post={reportPost as any}
      />
    </div>
  );
};
