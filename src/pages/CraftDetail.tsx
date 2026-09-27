import React, { useState } from 'react';
import { Project } from '../types/project';
import { ReferenceSourceTag } from '../components/craft-detail/ReferenceSourceTag';
import { InfoStatsRow } from '../components/craft-detail/InfoStatsRow';
import { MaterialsList } from '../components/craft-detail/MaterialsList';
import { StepList } from '../components/craft-detail/StepList';
import { PrecautionsBox } from '../components/craft-detail/PrecautionsBox';
import { GeneratedImageGallery } from '../components/craft-detail/GeneratedImageGallery';
import { EngagementBar } from '../components/craft-detail/EngagementBar';
import { UploadResultModal } from '../components/craft-detail/UploadResultModal';
import { Button } from '../components/common/Button';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Video, Sparkles, User, Share2, Bookmark } from 'lucide-react';

interface CraftDetailProps {
  project: Project;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const CraftDetail: React.FC<CraftDetailProps> = ({
  project,
  onBack,
  onNavigate,
}) => {
  const { addImplementedCraft } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Browse
        </Button>

        <div className="flex items-center gap-2">
          <ReferenceSourceTag
            source={project.source}
            authorName={project.author?.name}
          />
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--color-text-accent-dark)] tracking-tight leading-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg font-bold text-[var(--color-text-accent-dark)]/80 mt-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Media Showcase Branching by Source */}

      {/* Branch 1: In-App Post (Original High Res Cover Photo) */}
      {isInApp && (
        <div className="relative aspect-video sm:aspect-21/9 rounded-3xl border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] overflow-hidden bg-gray-100 mb-6">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {project.author && (
            <div className="absolute bottom-4 left-4 bg-white/95 px-3 py-1.5 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] flex items-center gap-2">
              <img
                src={project.author.avatar}
                alt={project.author.name}
                className="w-7 h-7 rounded-lg object-cover border border-[var(--color-text-accent-dark)]"
              />
              <span className="text-xs font-black">
                Original Post by {project.author.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Branch 2: YouTube Video Source (Embedded video + Generated from video label) */}
      {isYouTube && (
        <div className="mb-6 space-y-3">
          <div className="relative aspect-video rounded-3xl border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${project.youtubeVideoId || 'dQw4w9WgXcQ'}`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-3 bg-[#FFF6E0] border-[2px] border-[var(--color-text-accent-dark)] rounded-xl flex items-center gap-2 text-xs font-black text-[#3A3A3A] shadow-[2px_2px_0px_var(--color-text-accent-dark)]">
            <Sparkles className="w-4 h-4 text-[var(--color-secondary)] shrink-0" />
            <span>
              <strong>Generated from video:</strong> Steps, timing, and materials were auto-synthesized by AI from this video tutorial.
            </span>
          </div>
        </div>
      )}

      {/* Branch 3: No Match Found / Full AI Synthesis (Multi-stage Visual Gallery) */}
      {isAiGen && (
        <GeneratedImageGallery
          finalOutputImage={project.finalOutputImage || project.coverImage}
          inProgressImages={project.inProgressImages}
        />
      )}

      {/* Engagement Bar (Likes, Comments, Views, Implementation count, "Try It") */}
      <EngagementBar
        initialLikes={project.likes}
        commentsCount={project.commentsCount}
        views={project.views}
        implementationsCount={project.implementationsCount}
        onTryIt={() => setIsModalOpen(true)}
      />

      {/* Key Project Specs Row */}
      <InfoStatsRow
        timeRequired={project.timeRequired}
        estimatedCost={project.estimatedCost}
        difficulty={project.difficulty}
        material={project.material}
        isAiGeneratedLabel={isYouTube || isAiGen}
      />

      {/* Precautions Warning Box */}
      <PrecautionsBox precautions={project.precautions} />

      {/* Materials Needed Checklist */}
      <MaterialsList materials={project.materialsNeeded} />

      {/* Step by Step List */}
      <StepList steps={project.steps} isAiGenerated={isYouTube || isAiGen} />

      {/* Bottom Sticky Action Bar */}
      <div className="p-6 bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
        <div>
          <h3 className="font-black text-xl text-[var(--color-text-accent-dark)]">
            Did you build this project?
          </h3>
          <p className="text-xs sm:text-sm font-bold text-[var(--color-text-accent-dark)]/70">
            Upload your finished result photo to log eco-impact and inspire fellow makers.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsModalOpen(true)}
          icon={<Sparkles className="w-5 h-5 text-[#FFD166]" />}
        >
          Upload My Result Photo
        </Button>
      </div>

      {/* Upload My Result Modal (Section 1 Behavior) */}
      <UploadResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        craftTitle={project.title}
        referenceSource={project.source}
        referenceId={project.id}
        creatorName={project.author?.name}
        onSubmitResult={handleUploadResultSubmit}
      />
    </div>
  );
};
