import React, { useState } from 'react';
import { BeforeAfterUploader } from '../components/create-post/BeforeAfterUploader';
import { ProcessImagesUploader } from '../components/create-post/ProcessImagesUploader';
import { MaterialsForm } from '../components/create-post/MaterialsForm';
import { PostPreview } from '../components/create-post/PostPreview';
import { useUser } from '../context/UserContext';
import { postService } from '../services/postService';
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

  // Form State
  const [beforeImage, setBeforeImage] = useState<string>(
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
  );
  const [afterImage, setAfterImage] = useState<string>(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
  );
  const [processImages, setProcessImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
  ]);
  const [steps, setSteps] = useState([
    {
      stepNumber: 1,
      title: 'Cut Denim Leg Sleeves',
      instructions: 'Measure 2 inches below the pocket line and slice straight across with fabric shears.',
    },
    {
      stepNumber: 2,
      title: 'Double Stitch Bottom Hem',
      instructions: 'Turn inside out and run a reinforced zigzag seam across the base opening.',
    },
  ]);

  const [formData, setFormData] = useState({
    title: 'Reinforced Denim Market Carryall',
    description: 'Repurposed distressed work jeans into an ultra-tough reusable grocery tote with lined interior pockets.',
    materials: ['1 pair of distressed jeans', 'Polyester thread', 'Cotton lining fabric'],
    cost: '$2.00',
    timeTaken: '1 hour 20 mins',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    precautions: ['Use denim needle size 16 to avoid bending on triple seams'],
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

    try {
      // Create post via postService
      const newPost = await postService.createPost({
        title: formData.title,
        description: formData.description,
        beforeImage,
        afterImage,
        processImages,
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
      });

      // If flagged as contest entry, also submit to weekly contest
      if (formData.isContestEntry) {
        await contestService.submitContestEntry({
          postId: newPost.id,
          title: formData.title,
          description: formData.description,
          beforeImage,
          afterImage,
          materialType: formData.materials[0] || 'Upcycled',
          creator: {
            id: user.id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
          },
        });
      }

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      await refreshUser();
      onNavigate('community');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
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
            name: user?.name || 'Alex Rivera',
            username: user?.username || 'eco_crafter_alex',
            avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          }}
          publishing={publishing}
          onPublish={handlePublish}
          onPrev={() => setCurrentStep(3)}
        />
      )}
    </div>
  );
};
