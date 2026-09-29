// Supabase Edge Function: analyze-waste
// Deploy with: supabase functions deploy analyze-waste
// Set secret:  supabase secrets set OPENROUTER_API_KEY=your-key-here

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openrouter/free';

/** Extract the first complete JSON object from a text response.
 *  Handles markdown fences, leading prose, and trailing garbage. */
function extractJson(text: string): unknown {
  const stripped = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      `Response was truncated or invalid. Raw start: ${stripped.slice(0, 120)}`
    );
  }
  return JSON.parse(stripped.slice(start, end + 1));
}

/** Fetch from OpenRouter with automatic retry on 503/429 overload errors. */
async function openRouterPost(url: string, apiKey: string, body: unknown): Promise<Response> {
  const MAX_RETRIES = 3;
  let lastError = '';
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://wastetowonder.app',
        'X-Title': 'Waste to Wonder'
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    
    // Retry on rate limits or overload
    if (resp.status === 429 || resp.status === 503 || data.error?.message?.includes('rate limit')) {
      lastError = data.error?.message || `HTTP ${resp.status}`;
      continue;
    }
    return new Response(JSON.stringify(data), { status: resp.status });
  }
  throw new Error(`OpenRouter overloaded after ${MAX_RETRIES} retries: ${lastError}`);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  task: 'identify' | 'generateSteps' | 'generateCraft';
  imageBase64?: string;        // for identify
  imageBase64Array?: string[]; // for generateSteps from multiple process photos (legacy)
  imageUrlArray?: string[];    // for generateSteps from public URLs (preferred)
  material?: string;           // for generateCraft
  youtubeUrl?: string;         // for generateSteps from YouTube
  youtubeTitle?: string;       // Context so the LLM knows what the video is about
  mimeType?: string;           // e.g. "image/jpeg"
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) throw new Error('OPENROUTER_API_KEY secret not set');

    const body: RequestBody = await req.json();
    const { task } = body;

    const fetchAndParseJson = async (openRouterBody: any, apiKey: string, maxRetries = 3) => {
      let lastError = new Error('Unknown error');
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const resp = await openRouterPost(OPENROUTER_URL, apiKey, openRouterBody);
          const data = await resp.json();
          if (data.error) throw new Error(`API error: ${data.error.message}`);
          
          const text = data.choices?.[0]?.message?.content;
          if (!text) throw new Error('No content returned.');
          
          return extractJson(text);
        } catch (err) {
          lastError = err as Error;
          // If this is the last attempt, don't wait, just throw
          if (attempt === maxRetries - 1) break;
          // Wait a short delay before retrying
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      throw lastError;
    };

    let result: unknown;

    // ── TASK: identify ─────────────────────────────────────────
    if (task === 'identify') {
      const prompt = `You are an expert waste material analyst for an upcycling app.
Analyze this image of a waste/discarded item and respond with ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "label": "specific detailed description e.g. torn cotton denim jeans with frayed knees",
  "materialCategory": "one of: Fabric | Plastic | Glass | Paper-Cardboard | Metal | E-waste | Wood | Other",
  "confidence": 0.92,
  "condition": "specific physical condition details e.g. frayed hems, torn left knee",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}`;

      const openRouterBody = {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: { url: `data:${body.mimeType || 'image/jpeg'};base64,${body.imageBase64}` }
              }
            ]
          }
        ],
        temperature: 0.2
      };

      result = await fetchAndParseJson(openRouterBody, apiKey);

    // ── TASK: generateSteps (process images via public URLs) ──
    } else if (task === 'generateSteps' && body.imageUrlArray) {
      const prompt = `You are an expert upcycling tutorial writer.
These images show the process of creating a craft from ${body.material || 'waste material'}.
Analyze each image in sequence and generate a structured tutorial.
Respond ONLY with valid JSON in this exact format:
{
  "difficulty": "Easy|Medium|Hard",
  "precautions": ["precaution 1", "precaution 2"],
  "steps": [
    { "stepNumber": 1, "title": "Step title", "instructions": "Detailed instruction" }
  ]
}`;

      const content: any[] = [{ type: 'text', text: prompt }];
      for (const url of body.imageUrlArray) {
        content.push({ type: 'image_url', image_url: { url } });
      }

      const openRouterBody = {
        model: MODEL,
        messages: [{ role: 'user', content }],
        temperature: 0.3
      };

      result = await fetchAndParseJson(openRouterBody, apiKey);

    // ── TASK: generateSteps (process images via base64, legacy) ──
    } else if (task === 'generateSteps' && body.imageBase64Array) {
      const prompt = `You are an expert upcycling tutorial writer.
These images show the process of creating a craft from ${body.material || 'waste material'}.
Analyze each image in sequence and generate a structured tutorial.
Respond ONLY with valid JSON in this exact format:
{
  "difficulty": "Easy|Medium|Hard",
  "precautions": ["precaution 1", "precaution 2"],
  "steps": [
    { "stepNumber": 1, "title": "Step title", "instructions": "Detailed instruction" }
  ]
}`;

      const content: any[] = [{ type: 'text', text: prompt }];
      for (const b64 of body.imageBase64Array) {
        content.push({ 
          type: 'image_url', 
          image_url: { url: `data:${body.mimeType || 'image/jpeg'};base64,${b64}` }
        });
      }

      const openRouterBody = {
        model: MODEL,
        messages: [{ role: 'user', content }],
        temperature: 0.3
      };

      result = await fetchAndParseJson(openRouterBody, apiKey);

    // ── TASK: generateSteps (YouTube URL) ─────────────────────
    } else if (task === 'generateSteps' && body.youtubeUrl) {
      const prompt = `You are an expert upcycling tutorial writer.
Generate a complete DIY upcycling craft tutorial based on the following YouTube video.

Video Title: "${body.youtubeTitle || 'Unknown'}"
Video URL: ${body.youtubeUrl}

Respond ONLY with valid JSON in this format:
{
  "title": "craft title",
  "description": "brief description",
  "difficulty": "Easy|Medium|Hard",
  "timeRequired": "e.g. 45 min",
  "estimatedCost": "e.g. $5",
  "materialsNeeded": ["material 1", "material 2"],
  "precautions": ["precaution 1"],
  "steps": [
    { "stepNumber": 1, "title": "Step title", "instructions": "Detailed instruction" }
  ]
}`;

      const openRouterBody = {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3
      };

      result = await fetchAndParseJson(openRouterBody, apiKey);

    // ── TASK: generateCraft (no match found) ──────────────────
    } else if (task === 'generateCraft') {
      const prompt = `You are a creative upcycling expert.
Generate a detailed DIY upcycling craft guide for: "${body.material || 'waste material'}"
Respond ONLY with valid JSON:
{
  "title": "Creative craft name",
  "description": "Brief appealing description",
  "difficulty": "Easy|Medium|Hard",
  "timeRequired": "e.g. 1 hour",
  "estimatedCost": "e.g. $3",
  "wasteSaved": "e.g. 0.5 KG SAVED",
  "materialsNeeded": ["item 1", "item 2"],
  "precautions": ["safety note 1"],
  "steps": [
    { "stepNumber": 1, "title": "Step title", "instructions": "Detailed instructions" }
  ],
  "tags": ["tag1", "tag2"]
}`;

      const openRouterBody = {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5
      };

      result = await fetchAndParseJson(openRouterBody, apiKey);

    } else {
      throw new Error(`Unknown task: ${task}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
