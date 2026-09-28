// Supabase Edge Function: analyze-waste
// Deploy with: supabase functions deploy analyze-waste
// Set secret:  supabase secrets set GEMINI_API_KEY=your-key-here

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models';

/** Extract the first complete JSON object from a Gemini text response.
 *  Handles markdown fences, leading prose, and trailing garbage. */
function extractJson(text: string): unknown {
  // Strip markdown code fences
  const stripped = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
  // Find the first '{' and last '}' to isolate the JSON object
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      `Gemini response was truncated (maxOutputTokens too low). Increase token limit. Raw start: ${stripped.slice(0, 120)}`
    );
  }
  return JSON.parse(stripped.slice(start, end + 1));
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  task: 'identify' | 'generateSteps' | 'generateCraft' | 'generateImages';
  imageBase64?: string;        // for identify / generateSteps
  imageBase64Array?: string[]; // for generateSteps from multiple process photos (legacy)
  imageUrlArray?: string[];    // for generateSteps from public URLs (preferred)
  material?: string;           // for generateCraft / generateImages
  youtubeUrl?: string;         // for generateSteps from YouTube
  craftDescription?: string;   // for generateImages
  mimeType?: string;           // e.g. "image/jpeg"
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY secret not set');

    const body: RequestBody = await req.json();
    const { task } = body;

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

      const geminiBody = {
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: body.mimeType || 'image/jpeg', data: body.imageBase64 } }
          ]
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
      };

      const resp = await fetch(`${GEMINI_URL}/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });
      const data = await resp.json();
      if (data.error) throw new Error(`Gemini API error: ${data.error.message}`);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini returned no content. Check your API key and quota.');
      result = extractJson(text);

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

      const parts: unknown[] = [{ text: prompt }];
      for (const url of body.imageUrlArray) {
        // Use file_data with a public HTTPS URL — no base64 encoding needed
        parts.push({ file_data: { mime_type: 'image/jpeg', file_uri: url } });
      }

      const resp = await fetch(`${GEMINI_URL}/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.3, maxOutputTokens: 1500 } }),
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      result = extractJson(text);

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

      const parts: unknown[] = [{ text: prompt }];
      for (const b64 of body.imageBase64Array) {
        parts.push({ inline_data: { mime_type: body.mimeType || 'image/jpeg', data: b64 } });
      }

      const resp = await fetch(`${GEMINI_URL}/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.3, maxOutputTokens: 1500 } }),
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      result = extractJson(text);

    // ── TASK: generateSteps (YouTube URL) ─────────────────────
    } else if (task === 'generateSteps' && body.youtubeUrl) {
      const prompt = `You are an expert upcycling tutorial writer.
Watch/analyze this YouTube video: ${body.youtubeUrl}
Extract and generate a complete craft tutorial from it.
Respond ONLY with valid JSON:
{
  "title": "craft title from video",
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

      const resp = await fetch(`${GEMINI_URL}/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 }
        }),
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      result = extractJson(text);

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

      const resp = await fetch(`${GEMINI_URL}/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 2000 }
        }),
      });
      const data = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      result = extractJson(text);

    // ── TASK: generateImages ──────────────────────────────────
    } else if (task === 'generateImages') {
      // Uses Gemini 2.0 Flash image generation
      const prompts = [
        `Photorealistic image of a finished upcycled craft made from ${body.material}. ${body.craftDescription || ''}. Clean background, studio lighting.`,
        `Step 1 in-progress photo: raw ${body.material} laid out on workbench ready to be crafted. Natural lighting.`,
        `Step 2 in-progress photo: ${body.material} being assembled/shaped into a craft project. Hands visible, workshop setting.`,
      ];

      const imageResults = await Promise.all(
        prompts.map(async (imgPrompt) => {
          const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: imgPrompt }] }],
              generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
            }),
          });
          const data = await resp.json();
          const imgPart = data.candidates?.[0]?.content?.parts?.find((p: { inlineData?: unknown }) => p.inlineData);
          if (imgPart?.inlineData?.data) {
            return `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}`;
          }
          return null;
        })
      );
      result = { images: imageResults.filter(Boolean) };

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
