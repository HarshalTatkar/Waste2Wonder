import { Project } from '../types/project';
import mockProjectsData from '../data/mockProjects.json';

export interface ImageAnalysisResult {
  label: string; // e.g., "torn cotton T-shirt", "cracked glass jar"
  materialCategory: string;
  confidence: number;
  condition: string;
  suggestedTags: string[];
  matchedProjects: Project[];
}

export interface ChatbotFallbackResponse {
  reply: string;
  matchedMaterials: string[];
  suggestedCrafts: Project[];
}

export const aiService = {
  /**
   * Simulates AI vision identification of waste items.
   * Returns a detailed, non-generic label like "torn cotton T-shirt" as per spec.
   */
  identifyImage: async (images: (File | string)[]): Promise<ImageAnalysisResult> => {
    // Simulate real AI processing latency
    await new Promise((res) => setTimeout(res, 1400));

    const count = images.length;
    // Map to specific, rich labels
    const detections = [
      {
        label: "torn cotton denim trousers",
        materialCategory: "Fabric",
        confidence: 0.94,
        condition: "Frayed hems, torn left knee, 100% heavy weave cotton",
        suggestedTags: ["Fabric", "Denim", "Fashion", "Tote Bag"],
      },
      {
        label: "cracked clear 2-liter PET soda bottle",
        materialCategory: "Plastic",
        confidence: 0.92,
        condition: "Puncture on sidewall, food-grade transparent polyethylene",
        suggestedTags: ["Plastic", "Gardening", "Planter", "Suncatcher"],
      },
      {
        label: "fractured ceramic coffee mug with chipped handle",
        materialCategory: "Glass",
        confidence: 0.88,
        condition: "Stoneware clay body, fractured rim, clean fissure lines",
        suggestedTags: ["Glass", "Ceramic", "Lighting", "Kintsugi"],
      },
      {
        label: "corrugated cardboard shipping box with shipping labels",
        materialCategory: "Paper-Cardboard",
        confidence: 0.96,
        condition: "Double-fluted corrugated cardboard, dry and structural",
        suggestedTags: ["Paper-Cardboard", "Storage", "Desk Organizer"],
      },
    ];

    const chosen = detections[(count - 1 + detections.length) % detections.length];
    const allProjects = mockProjectsData as unknown as Project[];
    const matched = allProjects.filter((p) => p.material === chosen.materialCategory);

    return {
      label: chosen.label,
      materialCategory: chosen.materialCategory,
      confidence: chosen.confidence,
      condition: chosen.condition,
      suggestedTags: chosen.suggestedTags,
      matchedProjects: matched.length > 0 ? matched : allProjects.slice(0, 2),
    };
  },

  /**
   * Generates step-by-step tutorial based on uploaded process photos.
   */
  autoGenerateTutorial: async (
    processImages: string[],
    material: string
  ): Promise<{
    difficulty: 'Easy' | 'Medium' | 'Hard';
    precautions: string[];
    steps: { stepNumber: number; title: string; instructions: string }[];
  }> => {
    await new Promise((res) => setTimeout(res, 1000));
    return {
      difficulty: material === 'E-waste' || material === 'Glass' ? 'Medium' : 'Easy',
      precautions: [
        'Ensure all cut surfaces are lightly sanded to prevent skin irritation.',
        'Use appropriate ventilation if adhesives or sealants are applied.',
      ],
      steps: processImages.map((_, idx) => ({
        stepNumber: idx + 1,
        title: `Phase ${idx + 1}: ${idx === 0 ? 'Surface Prep & Measuring' : idx === 1 ? 'Forming & Assembly' : 'Finishing & Detailing'}`,
        instructions: `Carefully inspect and align the ${material.toLowerCase()} components according to your planned layout before applying adhesive or fasteners.`,
      })),
    };
  },

  /**
   * Chatbot fallback for low-confidence identification or queries.
   */
  chatbotFallback: async (query: string): Promise<ChatbotFallbackResponse> => {
    await new Promise((res) => setTimeout(res, 600));
    const lower = query.toLowerCase();
    const allProjects = mockProjectsData as unknown as Project[];

    let matchedMat = 'Fabric';
    if (lower.includes('bottle') || lower.includes('plastic') || lower.includes('pet')) {
      matchedMat = 'Plastic';
    } else if (lower.includes('box') || lower.includes('paper') || lower.includes('cardboard')) {
      matchedMat = 'Paper-Cardboard';
    } else if (lower.includes('glass') || lower.includes('mug') || lower.includes('cup') || lower.includes('ceramic')) {
      matchedMat = 'Glass';
    } else if (lower.includes('circuit') || lower.includes('tech') || lower.includes('electronic')) {
      matchedMat = 'E-waste';
    } else if (lower.includes('can') || lower.includes('metal') || lower.includes('tin')) {
      matchedMat = 'Metal';
    }

    const matched = allProjects.filter((p) => p.material.toLowerCase() === matchedMat.toLowerCase());

    return {
      reply: `I detected you're working with ${matchedMat}! Here are creative, verified upcycling crafts designed specifically to repurpose this material with zero landfill waste.`,
      matchedMaterials: [matchedMat],
      suggestedCrafts: matched.length > 0 ? matched : allProjects.slice(0, 2),
    };
  },
};
