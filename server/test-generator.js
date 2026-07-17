import { generateWebsite } from './ai/generator.js';

async function test() {
  console.log('🎬 Testing Enhanced Website Generator\n');
  console.log('Based on MotionSites analysis of 60+ production prompts\n');
  
  const prompt = 'Build a dark SaaS landing page for an AI writing assistant called "ProseAI". Hero section with background video, floating glassmorphic navbar, features grid with 4 cards, pricing table with 3 tiers, testimonials section, and footer. Use liquid glass effect on all interactive elements.';
  
  console.log('📝 Prompt:', prompt);
  console.log('🎨 Style: dark');
  console.log('⚡ Framework: html\n');
  
  try {
    const result = await generateWebsite(prompt, 'html', 'dark');
    console.log('✅ Generation successful!');
    console.log('🤖 Model:', result.model);
    console.log('🎭 Style:', result.style);
    console.log('📄 HTML length:', result.html?.length || 0, 'chars');
    console.log('💡 Notes:', result.notes);
    
    // Save the output
    import('fs').then(fs => {
      fs.default.writeFileSync('../test-output.html', result.html);
      console.log('\n✅ Saved to test-output.html');
      console.log('\nOpen test-output.html in a browser to see the result!');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nStack:', error.stack);
    console.error('\nThis might be because the Groq API key is not set.');
    console.error('Make sure .env file has GROQ_API_KEY set.');
  }
}

test();
