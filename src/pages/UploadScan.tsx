import React, { useState } from 'react';
import { DropZone } from '../components/upload/DropZone';
import { ImagePreviewGrid } from '../components/upload/ImagePreviewGrid';
import { AnalysisLoader } from '../components/upload/AnalysisLoader';
import { ChatbotFallback } from '../components/upload/ChatbotFallback';
import { ProjectCard } from '../components/explore/ProjectCard';
import { Button } from '../components/common/Button';
import { useImageUpload } from '../hooks/useImageUpload';
import { aiService, ImageAnalysisResult } from '../services/aiService';
import { Project } from '../types/project';
import { Sparkles, Camera, CheckCircle2, RotateCcw, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface UploadScanProps {
  onNavigate: (page: string, params?: any) => void;
}

export const UploadScan: React.FC<UploadScanProps> = ({ onNavigate }) => {
  const { images, error, addFiles, removeImage, clearImages } = useImageUpload(4);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  // Quick preset sample photos for instant testing
  const samplePresets = [
    {
      title: 'Torn Cotton Denim Jeans',
      url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Clear PET Soda Bottle',
      url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Corrugated Shipping Flute',
      url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleSelectSample = async (url: string, name: string) => {
    try {
      // Mock File object from preset
      const mockFile = new File(['mock'], `${name}.jpg`, { type: 'image/jpeg' });
      addFiles([mockFile]);
    } catch {
      // Fallback
    }
  };

  const handleStartAnalysis = async () => {
    if (images.length === 0) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await aiService.identifyImage(images.map((i) => i.file));
      setAnalysisResult(res);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    clearImages();
    setAnalysisResult(null);
    setShowChatbot(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-left mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-[2px] border-black rounded-full text-xs font-black shadow-[2px_2px_0px_#000] uppercase tracking-wider mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>AI Vision Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight uppercase">
          SNAP YOUR WASTE MATERIAL
        </h1>
        <p className="text-sm sm:text-base font-bold text-black/75 mt-1 max-w-2xl">
          Upload up to 4 photos. Our AI vision model identifies the material condition and finds step-by-step DIY project ideas.
        </p>
      </div>

      {!analysisResult && !analyzing && (
        <div className="space-y-6">
          {/* Preset Buttons for Instant Demo Testing */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-white/80 rounded-2xl border-[2px] border-[var(--color-text-accent-dark)] shadow-[3px_3px_0px_var(--color-text-accent-dark)] text-xs font-black">
            <span className="text-[var(--color-secondary)] uppercase">Quick Sample Presets:</span>
            {samplePresets.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(sp.url, sp.title)}
                className="px-3 py-1 bg-[var(--color-background)] rounded-lg border border-[var(--color-text-accent-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
              >
                + {sp.title}
              </button>
            ))}
          </div>

          {/* Upload Drop Zone (disabled past 4 photos) */}
          <DropZone
            currentCount={images.length}
            maxCount={4}
            disabled={analyzing}
            onFilesSelected={addFiles}
          />

          {error && (
            <div className="p-3 bg-[#FF6B6B]/20 border-[2px] border-[#FF6B6B] rounded-xl text-xs font-black text-[var(--color-text-accent-dark)]">
              {error}
            </div>
          )}

          {/* Removable Preview Thumbnails */}
          <ImagePreviewGrid images={images} onRemove={removeImage} maxCount={4} />

          {/* Submit Action */}
          {images.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-[2px] border-[var(--color-text-accent-dark)]/20">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Clear All
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartAnalysis}
                icon={<Sparkles className="w-5 h-5 text-[#FFD166]" />}
              >
                Analyze {images.length} Photo{images.length > 1 ? 's' : ''} with AI Vision
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Analyzing Progress State */}
      {analyzing && <AnalysisLoader />}

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Detailed Identification Result Banner */}
          <div className="neu-card bg-white border-[3px] border-[var(--color-text-accent-dark)] shadow-[6px_6px_0px_var(--color-text-accent-dark)] rounded-3xl p-6 sm:p-8 text-left">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-6 border-b-[2px] border-[var(--color-text-accent-dark)]/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-[var(--color-primary)] text-white text-[10px] font-black rounded-md uppercase">
                    AI Vision Identified
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-accent-dark)]/70">
                    Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Specific, non-generic detailed label as required by spec */}
                <h2 className="text-2xl sm:text-4xl font-black text-[var(--color-text-accent-dark)] capitalize">
                  "{analysisResult.label}"
                </h2>

                <p className="text-sm font-bold text-[var(--color-text-accent-dark)]/80 mt-1">
                  Detected properties: <span className="text-[var(--color-secondary)]">{analysisResult.condition}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleReset} icon={<RotateCcw className="w-4 h-4" />}>
                  Scan Another Item
                </Button>
                <Button
                  variant="cream"
                  size="sm"
                  onClick={() => setShowChatbot(!showChatbot)}
                  icon={<HelpCircle className="w-4 h-4 text-black" />}
                >
                  {showChatbot ? 'Hide Assistant' : 'Need Custom Ideas?'}
                </Button>
              </div>
            </div>

            {/* Matched Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase text-black/70">
                Identified:
              </span>
              {analysisResult.suggestedTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white rounded-full border-[1.5px] border-black text-xs font-black"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Chatbot Fallback Accordion / Toggle */}
          {showChatbot && (
            <ChatbotFallback
              initialMaterial={analysisResult.materialCategory}
              onSelectCraft={(craft) => onNavigate('craft-detail', { project: craft })}
            />
          )}

          {/* Recommended Craft Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-black text-black">
                  Recommended Projects for Your Waste
                </h3>
                <p className="text-xs sm:text-sm font-bold text-black/70">
                  Step-by-step DIY project ideas matched to this material
                </p>
              </div>
              <span className="px-3 py-1 bg-white border-[2px] border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_#000]">
                {analysisResult.matchedProjects.length} Projects Found
              </span>
            </div>

            {/* Vertical Stack of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysisResult.matchedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onSelect={(p) => onNavigate('craft-detail', { project: p })}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
