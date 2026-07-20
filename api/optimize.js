// Vercel Serverless Function — /api/optimize
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, input, context } = req.body;

    let prompt;
    switch (type) {
      case 'website':
        prompt = `Analyze this website and extract the design patterns, color scheme, typography, layout structure, and UI/UX patterns. Return a detailed analysis that could be used to recreate similar designs.\n\nWebsite URL: ${input}`;
        break;
      case 'image':
        prompt = `Analyze this image in detail. Describe the visual elements, composition, colors, typography (if any), layout, and design style. Return analysis that could recreate this design.`;
        break;
      case 'text':
        prompt = `Optimize this prompt for maximum effectiveness:\n\n${input}`;
        break;
      case 'generate-website':
        prompt = `Generate a complete, production-ready website based on this description. Return ONLY valid HTML with inline CSS and JavaScript. Make it modern, responsive, and visually stunning.\n\nDescription: ${input}${context ? `\n\nAdditional context: ${context}` : ''}`;
        break;
      default:
        prompt = `Analyze and optimize this prompt:\n\n${input}`;
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an expert prompt engineer and web developer. Return detailed, actionable responses in JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      max_tokens: 4096
    });

    const result = completion.choices[0].message.content;

    return res.json({
      type,
      input,
      result,
      tokens: {
        prompt: completion.usage?.prompt_tokens || 0,
        completion: completion.usage?.completion_tokens || 0,
        total: completion.usage?.total_tokens || 0
      }
    });
  } catch (error) {
    console.error('[Optimize API Error]', error.message);
    return res.status(500).json({ error: error.message });
  }
}
