import { supabase } from '../lib/supabase';
import { Project } from '../types/project';
import { postService } from './postService';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string;

export interface ImageAnalysisResult {
  label: string;
  materialCategory: string;
  confidence: number;
  condition: string;
  suggestedTags: string[];
  matchedProjects: Project[];
  youtubeResults: YouTubeResult[];
}

export interface YouTubeResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  url: string;
}

export interface ChatbotFallbackResponse {
  reply: string;
  matchedMaterials: string[];
  suggestedCrafts: Project[];
}

// ── Helpers ───────────────────────────────────────────────────

/** Convert a File to base64 string (without data: prefix) */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // strip "data:image/jpeg;base64,"
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Upload a file to Supabase Storage and return its public URL */
async function uploadToStorage(file: File, bucket = 'uploads'): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** Call the Supabase Edge Function */
async function callEdgeFunction<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('analyze-waste', { body });
  if (error) {
    // FunctionsHttpError carries the actual response body — extract it
    const context = (error as unknown as { context?: Response }).context;
    if (context) {
      try {
        const body = await context.json();
        throw new Error(body?.error || error.message);
      } catch (e) {
        if (e instanceof Error && e.message !== error.message) throw e;
      }
    }
    throw new Error(
      error.message.includes('Failed to send')
        ? 'Edge Function not deployed. Run: supabase functions deploy analyze-waste'
        : error.message
    );
  }
  if (!data || typeof data !== 'object') throw new Error(
    'Edge Function returned an empty response. Make sure GEMINI_API_KEY secret is set.'
  );
  if (data.error) throw new Error(data.error);
  return data as T;
}

/** Search YouTube for upcycling/DIY videos about a specific material */
async function searchYouTube(materialCategory: string): Promise<YouTubeResult[]> {
  if (!YOUTUBE_API_KEY) return [];
  // Use the material category as the primary query, with strong upcycling intent keywords.
  // Avoid using the verbose Gemini label which confuses YouTube's ranking.
  const query = `${materialCategory} upcycling DIY craft tutorial how to make`;
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&videoCategoryId=26&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
    const resp = await fetch(url);
    const json = await resp.json();
    return (json.items ?? []).map((item: Record<string, unknown>) => {
      const snippet = item.snippet as Record<string, unknown>;
      const id = item.id as Record<string, unknown>;
      const thumbs = snippet.thumbnails as Record<string, unknown>;
      const medium = thumbs?.medium as Record<string, unknown>;
      return {
        videoId: id.videoId as string,
        title: snippet.title as string,
        channelTitle: snippet.channelTitle as string,
        thumbnail: (medium?.url as string) || '',
        url: `https://www.youtube.com/watch?v=${id.videoId}`,
      };
    });
  } catch {
    return [];
  }
}

// ── Post → Project shape mapper ───────────────────────────────
function postToProject(post: import('../types/post').Post): Project {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    source: 'in_app',
    material: post.materials[0] || '',
    difficulty: post.difficulty,
    timeRequired: post.timeTaken,
    estimatedCost: post.cost,
    materialsNeeded: post.materials,
    precautions: post.precautions,
    steps: post.steps.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      instructions: s.instructions,
    })),
    coverImage: post.afterImage,
    likes: post.likes,
    commentsCount: post.comments.length,
    views: post.views,
    implementationsCount: post.implementationsCount,
    createdAt: post.createdAt,
    tags: post.materials,
  };
}

// ── Main service ──────────────────────────────────────────────
export const aiService = {
  /**
   * Identifies the waste item in uploaded image(s) using Gemini via Edge Function.
   * Then searches Supabase posts + YouTube in parallel for matching references.
   */
  identifyImage: async (images: (File | string)[]): Promise<ImageAnalysisResult> => {
    const file = images[0];
    if (!file) throw new Error('No image provided');

    // Convert to base64
    const base64 = file instanceof File ? await fileToBase64(file) : file;
    const mimeType = file instanceof File ? file.type || 'image/jpeg' : 'image/jpeg';

    // Step 1: Identify via Gemini
    const identification = await callEdgeFunction<{
      label: string;
      materialCategory: string;
      confidence: number;
      condition: string;
      suggestedTags: string[];
    }>({ task: 'identify', imageBase64: base64, mimeType });

    if (!identification.label) throw new Error(
      'Gemini did not return a valid identification. Check that GEMINI_API_KEY is set as a Supabase secret.'
    );

    // Step 2: Search in-app posts + YouTube in parallel
    const [matchedPosts, youtubeResults] = await Promise.all([
      postService.searchPosts(identification.label),
      searchYouTube(identification.materialCategory),
    ]);

    const matchedProjects = matchedPosts.map(postToProject);

    return {
      label: identification.label,
      materialCategory: identification.materialCategory,
      confidence: identification.confidence,
      condition: identification.condition,
      suggestedTags: identification.suggestedTags,
      matchedProjects,
      youtubeResults,
    };
  },

  /**
   * Extracts a full craft tutorial from a YouTube URL using Gemini.
   */
  generateStepsFromYouTube: async (youtubeUrl: string): Promise<{
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeRequired: string;
    estimatedCost: string;
    materialsNeeded: string[];
    precautions: string[];
    steps: { stepNumber: number; title: string; instructions: string }[];
  }> => {
    return callEdgeFunction({ task: 'generateSteps', youtubeUrl });
  },

  /**
   * Generates a step-by-step tutorial from process images uploaded by the user.
   * Used in post creation flow (Requirement 2B).
   */
  autoGenerateTutorial: async (
    processImages: string[],
    material: string
  ): Promise<{
    difficulty: 'Easy' | 'Medium' | 'Hard';
    precautions: string[];
    steps: { stepNumber: number; title: string; instructions: string }[];
  }> => {
    // Pass public Storage URLs directly — the edge function forwards them to
    // Gemini as file_data parts, avoiding a costly client-side re-download
    // and preventing large base64 payloads from triggering a timeout.
    return callEdgeFunction({
      task: 'generateSteps',
      imageUrlArray: processImages,
      material,
    });
  },

  /**
   * When no in-app post or YouTube reference is found, generate a full craft guide
   * plus AI-generated reference images (Requirement 1E).
   */
  generateFullCraft: async (
    materialLabel: string
  ): Promise<Project & { inProgressImages: string[]; finalOutputImage: string }> => {
    // Run craft guide generation and image generation in parallel
    const [craftGuide, { images: generatedImages }] = await Promise.all([
      callEdgeFunction<{
        title: string;
        description: string;
        difficulty: 'Easy' | 'Medium' | 'Hard';
        timeRequired: string;
        estimatedCost: string;
        wasteSaved: string;
        materialsNeeded: string[];
        precautions: string[];
        steps: { stepNumber: number; title: string; instructions: string }[];
        tags: string[];
      }>({ task: 'generateCraft', material: materialLabel }),
      callEdgeFunction<{ images: string[] }>({
        task: 'generateImages',
        material: materialLabel,
        craftDescription: materialLabel, // use material label as fallback; description not yet known
      }),
    ]);

    return {
      id: `ai-${Date.now()}`,
      source: 'ai_generated',
      material: materialLabel,
      title: craftGuide.title,
      description: craftGuide.description,
      difficulty: craftGuide.difficulty,
      timeRequired: craftGuide.timeRequired,
      estimatedCost: craftGuide.estimatedCost,
      wasteSaved: craftGuide.wasteSaved,
      materialsNeeded: craftGuide.materialsNeeded,
      precautions: craftGuide.precautions,
      steps: craftGuide.steps,
      tags: craftGuide.tags,
      coverImage: generatedImages[0] || '',
      finalOutputImage: generatedImages[0] || '',
      inProgressImages: generatedImages.slice(1),
      likes: 0,
      commentsCount: 0,
      views: 0,
      implementationsCount: 0,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Chatbot fallback — searches posts by material keyword.
   */
  chatbotFallback: async (query: string): Promise<ChatbotFallbackResponse> => {
    const lower = query.toLowerCase();
    let matchedMat = 'Fabric';
    if (lower.includes('bottle') || lower.includes('plastic')) matchedMat = 'Plastic';
    else if (lower.includes('box') || lower.includes('cardboard')) matchedMat = 'Paper-Cardboard';
    else if (lower.includes('glass') || lower.includes('mug') || lower.includes('ceramic')) matchedMat = 'Glass';
    else if (lower.includes('circuit') || lower.includes('electronic')) matchedMat = 'E-waste';
    else if (lower.includes('can') || lower.includes('metal') || lower.includes('tin')) matchedMat = 'Metal';

    const posts = await postService.searchPosts(matchedMat);
    const suggestedCrafts = posts.map(postToProject);

    return {
      reply: `I detected you're working with ${matchedMat}! Here are creative upcycling crafts matched to this material.`,
      matchedMaterials: [matchedMat],
      suggestedCrafts,
    };
  },

  /** Utility: upload a file to Supabase Storage and return its URL */
  uploadFile: uploadToStorage,
};
