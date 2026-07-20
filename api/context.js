// Vercel Serverless Function — /api/context
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    switch (req.method) {
      case 'GET':
        // Return context templates
        return res.json({
          templates: [
            { id: 'role', name: 'Expert Role', template: 'You are an expert in {{field}} with {{years}} years of experience.' },
            { id: 'format', name: 'Output Format', template: 'Return your response as {{format}} with {{constraints}}.' },
            { id: 'chain', name: 'Chain of Thought', template: 'Think step by step. {{instruction}}' },
            { id: 'few-shot', name: 'Few-Shot Examples', template: '{{instruction}}\n\nExamples:\n{{examples}}' }
          ]
        });

      case 'POST': {
        const { template, variables } = req.body;
        
        // Fill template variables
        let filled = template;
        for (const [key, value] of Object.entries(variables)) {
          filled = filled.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        return res.json({ filled, template, variables });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[Context API Error]', error.message);
    return res.status(500).json({ error: error.message });
  }
}
