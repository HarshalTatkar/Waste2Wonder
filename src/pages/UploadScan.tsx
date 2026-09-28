import React, { useState, useCallback } from 'react';
import { DropZone } from '../components/upload/DropZone';
import { ImagePreviewGrid } from '../components/upload/ImagePreviewGrid';
import { AnalysisLoader } from '../components/upload/AnalysisLoader';
import { ChatbotFallback } from '../components/upload/ChatbotFallback';
import { ProjectCard } from '../components/explore/ProjectCard';
import { Button } from '../components/common/Button';
import { useImageUpload } from '../hooks/useImageUpload';
import { aiService, ImageAnalysisResult } from '../services/aiService';
import { Project } from '../types/project';
import { Sparkles, Camera, RotateCcw, AlertCircle, HelpCircle, PlayCircle, ExternalLink, Wand2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { YouTubeResult } from '../services/aiService';

interface UploadScanProps {
  onNavigate: (page: string, params?: any) => void;
}

export const UploadScan: React.FC<UploadScanProps> = ({ onNavigate }) => {
  const { images, error, addFiles, removeImage, clearImages } = useImageUpload(4);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [generatingCraft, setGeneratingCraft] = useState(false);
  const [generatedCraft, setGeneratedCraft] = useState<Project | null>(null);
  const [youtubeSteps, setYoutubeSteps] = useState<Record<string, { loading: boolean; steps: { stepNumber: number; title: string; instructions: string }[] | null; error: string | null; collapsed: boolean }>>({});

  // Stores the fetched steps keyed by videoId. `collapsed` tracks whether the user has collapsed it.
  const handleFetchYoutubeSteps = useCallback(async (vid: YouTubeResult) => {
    const existing = youtubeSteps[vid.videoId];
    if (existing && existing.steps) {
      // Toggle collapse/expand — preserve the fetched steps
      setYoutubeSteps(prev => ({
        ...prev,
        [vid.videoId]: { ...prev[vid.videoId], collapsed: !prev[vid.videoId].collapsed }
      }));
      return;
    }
    if (existing?.loading) return; // Already fetching
    setYoutubeSteps(prev => ({ ...prev, [vid.videoId]: { loading: true, steps: null, error: null, collapsed: false } }));
    // 20 s timeout so the button never hangs forever
    const timeout = setTimeout(() => {
      setYoutubeSteps(prev => {
        if (prev[vid.videoId]?.loading) {
          return { ...prev, [vid.videoId]: { loading: false, steps: null, error: 'Request timed out. Please try again.', collapsed: false } };
        }
        return prev;
      });
    }, 20000);
    try {
      const res = await aiService.generateStepsFromYouTube(vid.url, vid.title);
      setYoutubeSteps(prev => ({ ...prev, [vid.videoId]: { loading: false, steps: res.steps, error: null, collapsed: false } }));
    } catch (err) {
      setYoutubeSteps(prev => ({ ...prev, [vid.videoId]: { loading: false, steps: null, error: (err as Error).message, collapsed: false } }));
    } finally {
      clearTimeout(timeout);
    }
  }, [youtubeSteps]);

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
      // Fetch the actual image from the preset URL so Gemini receives real pixels
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], `${name.replace(/\s+/g, '_')}.jpg`, {
        type: blob.type || 'image/jpeg',
      });
      addFiles([file]);
    } catch {
      // Fallback: inform the user the fetch failed
      setAnalysisError('Could not download the sample image. Please upload your own photo.');
    }
  };

  const handleStartAnalysis = async () => {
    if (images.length === 0) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);

    try {
      const res = await aiService.identifyImage(images.map((i) => i.file));
      // Normalise — guard every array field so a partial API response never crashes the render
      setAnalysisResult({
        ...res,
        suggestedTags:      Array.isArray(res.suggestedTags)      ? res.suggestedTags      : [],
        matchedProjects:    Array.isArray(res.matchedProjects)    ? res.matchedProjects    : [],
        youtubeResults:     Array.isArray(res.youtubeResults)     ? res.youtubeResults     : [],
      });
    } catch (err) {
      setAnalysisError((err as Error).message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateCraft = async () => {
    if (!analysisResult) return;
    setGeneratingCraft(true);
    try {
      const craft = await aiService.generateFullCraft(analysisResult.label);
      setGeneratedCraft(craft);
    } catch (err) {
      setAnalysisError((err as Error).message);
    } finally {
      setGeneratingCraft(false);
    }
  };

  const handleReset = () => {
    clearImages();
    setAnalysisResult(null);
    setAnalysisError(null);
    setShowChatbot(false);
    setGeneratedCraft(null);
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

          {analysisError && (
            <div className="flex items-start gap-2 p-4 bg-[#FF6B6B]/20 border-[2px] border-[#FF6B6B] rounded-xl">
              <AlertCircle className="w-4 h-4 text-[#FF6B6B] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black text-[var(--color-text-accent-dark)]">Analysis failed</p>
                <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/80 mt-0.5">{analysisError}</p>
                <p className="text-xs font-bold text-[var(--color-text-accent-dark)]/60 mt-1">
                  Make sure the Edge Function is deployed: <code className="bg-black/10 px-1 rounded">supabase functions deploy analyze-waste</code>
                </p>
              </div>
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

          {/* YouTube Tutorial Links */}
          {analysisResult.youtubeResults.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="w-5 h-5 text-[#FF0000]" />
                <h3 className="text-2xl font-black text-black">YouTube Tutorials</h3>
                <span className="px-2 py-0.5 bg-white border-[2px] border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_#000]">
                  {analysisResult.youtubeResults.length} Videos
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysisResult.youtubeResults.map((vid) => {
                  const ys = youtubeSteps[vid.videoId];
                  const isOpen = !!ys?.steps && !ys?.collapsed;
                  return (
                    <div key={vid.videoId} className="bg-white rounded-2xl border-[2px] border-black shadow-[3px_3px_0px_#000] overflow-hidden">
                      {/* Video header row */}
                      <div className="flex gap-3 p-3">
                        <img
                          src={vid.thumbnail}
                          alt={vid.title}
                          className="w-24 h-16 object-cover rounded-xl border border-black flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-black line-clamp-2">{vid.title}</p>
                          <p className="text-[10px] font-bold text-black/60 mt-1">{vid.channelTitle}</p>
                          <a href={vid.url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-[var(--color-primary)]">
                            Watch on YouTube <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      {/* Get Steps button */}
                      <button
                        type="button"
                        onClick={() => handleFetchYoutubeSteps(vid)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-[var(--color-background)] border-t-[2px] border-black text-xs font-black hover:bg-[var(--color-primary)] hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{ys?.loading ? 'Generating steps…' : isOpen ? 'Hide Step-by-Step Guide' : '⚡ Get Step-by-Step Guide'}</span>
                        {ys?.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {/* Steps dropdown */}
                      {ys?.error && (
                        <div className="px-4 py-2 text-xs font-bold text-[#FF6B6B] border-t border-black/10">{ys.error}</div>
                      )}
                      {isOpen && ys?.steps && (
                        <div className="border-t-[2px] border-black/10 p-4 space-y-3 max-h-72 overflow-y-auto">
                          {ys.steps.map((step) => (
                            <div key={step.stepNumber} className="flex gap-3">
                              <span className="w-6 h-6 rounded-lg bg-[var(--color-secondary)] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                {step.stepNumber}
                              </span>
                              <div>
                                <p className="text-xs font-black text-black">{step.title}</p>
                                <p className="text-xs font-bold text-black/70 mt-0.5">{step.instructions}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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

            {/* Project cards */}
            {analysisResult.matchedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.matchedProjects.map((proj) => (
                  <ProjectCard
                    key={proj.id}
                    project={proj}
                    onSelect={(p) => onNavigate('craft-detail', { project: p })}
                  />
                ))}
              </div>
            ) : (
              /* No in-app posts found — offer AI-generated craft */
              <div className="p-6 bg-white rounded-2xl border-[2px] border-dashed border-black/30 text-center space-y-3">
                <p className="text-sm font-black text-black/70">
                  No community projects found for this material yet.
                </p>
                {!generatedCraft && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleGenerateCraft}
                    disabled={generatingCraft}
                    icon={<Wand2 className="w-4 h-4" />}
                  >
                    {generatingCraft ? 'Generating AI Craft Guide…' : 'Generate AI Craft Guide'}
                  </Button>
                )}
                {generatedCraft && (
                  <div className="text-left mt-4">
                    <ProjectCard
                      project={generatedCraft}
                      onSelect={(p) => onNavigate('craft-detail', { project: p })}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
