import React, { useState } from 'react';
import { BeforeAfterUploader } from '../components/create-post/BeforeAfterUploader';
import { ProcessImagesUploader } from '../components/create-post/ProcessImagesUploader';
import { MaterialsForm } from '../components/create-post/MaterialsForm';
import { PostPreview } from '../components/create-post/PostPreview';
import { useUser } from '../context/UserContext';
import { postService, storageService } from '../services/postService';
import { contestService } from '../services/contestService';
import confetti from 'canvas-confetti';

interface CreatePostProps {
  onNavigate: (page: string, params?: any) => void;
  isContestEntryInitial?: boolean;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  onNavigate,
  isContestEntryInitial = false,
}) => {
  const { user, refreshUser } = useUser();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Form State
  const [beforeImage, setBeforeImage] = useState<string>('');
  const [afterImage, setAfterImage] = useState<string>('');
  const [processImages, setProcessImages] = useState<string[]>([]);
  const [steps, setSteps] = useState<{ stepNumber: number; title: string; instructions: string }[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    materials: [] as string[],
    cost: '',
    timeTaken: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    precautions: [] as string[],
    isContestEntry: isContestEntryInitial,
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAutoDetermine = (data: {
    difficulty: 'Easy' | 'Medium' | 'Hard';
    precautions: string[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      difficulty: data.difficulty,
      precautions: data.precautions,
    }));
  };

  const handlePublish = async () => {
    if (!user) return;
    setPublishing(true);
    setPublishError(null);

    try {
      // 1. Upload local blob images to Supabase Storage
      const finalBefore = await storageService.uploadImage(beforeImage, `before_${user.id}`);
      const finalAfter = await storageService.uploadImage(afterImage, `after_${user.id}`);
      
      const finalProcess = await Promise.all(
        processImages.map((img, i) => storageService.uploadImage(img, `process_${user.id}_${i}`))
      );

      // 2. Create post via postService (authorId replaces the author object)
      const newPost = await postService.createPost({
        title: formData.title,
        description: formData.description,
        beforeImage: finalBefore,
        afterImage: finalAfter,
        processImages: finalProcess,
        materials: formData.materials,
        cost: formData.cost,
        timeTaken: formData.timeTaken,
        difficulty: formData.difficulty,
        precautions: formData.precautions,
        steps,
        author: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          role: 'Community Maker',
        },
        isContestEntry: formData.isContestEntry,
        authorId: user.id,
      });

      // If flagged as contest entry, also submit to weekly contest
      if (formData.isContestEntry) {
        await contestService.submitContestEntry(newPost.id);
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      await refreshUser();
      onNavigate('community');
    } catch (err) {
      setPublishError((err as Error).message || 'Failed to publish post. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Publish Error Banner */}
      {publishError && (
        <div className="mb-6 p-4 bg-[#FF6B6B]/20 border-[2px] border-[#FF6B6B] rounded-xl flex items-start gap-2">
          <span className="text-sm">⚠️</span>
          <div>
            <p className="text-xs font-black text-[var(--color-text-accent-dark)]">Publishing failed</p>
            <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/80 mt-0.5">{publishError}</p>
          </div>
        </div>
      )}

      {/* Step Indicator Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2 max-w-xl mx-auto mb-4">
          {[
            { step: 1, label: 'Before & After' },
            { step: 2, label: 'Process & AI' },
            { step: 3, label: 'Materials & Specs' },
            { step: 4, label: 'Preview & Publish' },
          ].map((s) => (
            <div key={s.step} className="flex-1 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl border-[2px] border-[var(--color-text-accent-dark)] font-black text-xs flex items-center justify-center transition-all ${
                  currentStep === s.step
                    ? 'bg-[var(--color-secondary)] text-white shadow-[3px_3px_0px_var(--color-text-accent-dark)]'
                    : currentStep > s.step
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-text-accent-dark)]/50'
                }`}
              >
                {s.step}
              </div>
              <span className="text-[10px] font-black text-[var(--color-text-accent-dark)]/70 uppercase mt-1 hidden sm:inline-block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Before & After */}
      {currentStep === 1 && (
        <BeforeAfterUploader
          beforeImage={beforeImage}
          afterImage={afterImage}
          onBeforeChange={setBeforeImage}
          onAfterChange={setAfterImage}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: Process Photos & AI Step Generator */}
      {currentStep === 2 && (
        <ProcessImagesUploader
          processImages={processImages}
          onImagesChange={setProcessImages}
          steps={steps}
          onStepsChange={setSteps}
          onAutoDetermine={handleAutoDetermine}
          onNext={() => setCurrentStep(3)}
          onPrev={() => setCurrentStep(1)}
        />
      )}

      {/* Step 3 & 4: Materials, Cost, Time & Auto-Determined Specs */}
      {currentStep === 3 && (
        <MaterialsForm
          data={formData}
          onChange={handleFieldChange}
          onNext={() => setCurrentStep(4)}
          onPrev={() => setCurrentStep(2)}
        />
      )}

      {/* Step 5: Preview & Publish */}
      {currentStep === 4 && (
        <PostPreview
          data={{
            ...formData,
            beforeImage,
            afterImage,
            steps,
          }}
          author={{
            name: user?.name || '',
            username: user?.username || '',
            avatar: user?.avatar || '',
          }}
          publishing={publishing}
          onPublish={handlePublish}
          onPrev={() => setCurrentStep(3)}
        />
      )}
    </div>
  );
};
