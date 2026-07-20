// Vercel Serverless Function — /api/prompts
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    switch (req.method) {
      case 'GET':
        // Return empty array — client stores locally
        return res.json({ prompts: [] });

      case 'POST': {
        const { title, original, modality = 'text' } = req.body;
        
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert prompt engineer. Optimize the given prompt for clarity, specificity, and effectiveness. Return JSON with: { "optimized": "...", "score": 1-100, "confidence": "low|medium|high", "improvements": ["..."] }`
            },
            { role: 'user', content: original }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        });

        const result = JSON.parse(completion.choices[0].message.content);
        
        return res.json({
          id: Date.now(),
          title: title || 'Untitled Prompt',
          original,
          optimized: result.optimized,
          score: result.score,
          confidence: result.confidence,
          improvements: result.improvements,
          modality,
          created_at: new Date().toISOString()
        });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Prompts API Error]', error.message);
    return res.status(500).json({ error: error.message });
  }
}
