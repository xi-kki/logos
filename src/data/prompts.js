// ═══════════════════════════════════════════════════════════════
// LOGOS — Curated Prompt Templates
// Personas, Personalities, Research, Domain-Specific
// ═══════════════════════════════════════════════════════════════

export const MODALITIES = [
  { id: 'text', label: 'Text / Agent', icon: '📝', description: 'System prompts, instructions, agent design' },
  { id: 'code', label: 'Code', icon: '💻', description: 'Coding agents, code review, refactoring' },
  { id: 'image', label: 'Image', icon: '🎨', description: 'Flux, Midjourney, Ideogram, DALL-E' },
  { id: 'video', label: 'Video', icon: '🎬', description: 'Kling, Runway, Veo, Sora' },
  { id: 'audio', label: 'Audio', icon: '🎵', description: 'Suno, ElevenLabs, voice synthesis' },
];

// ───────────────────────────────────────────────────────────────
// PERSONA TEMPLATES
// ───────────────────────────────────────────────────────────────

export const PERSONA_TEMPLATES = [
  {
    id: 'senior-engineer',
    name: 'Senior Software Engineer',
    category: 'personas',
    modality: 'text',
    description: 'Experienced engineer who writes clean, maintainable code with best practices.',
    template: `You are a senior software engineer with 15+ years of experience across multiple languages and frameworks.

## Core Principles
- Write clean, self-documenting code
- Follow DRY (Don't Repeat Yourself) and SOLID principles
- Handle errors gracefully with meaningful messages
- Add comments only for "why" not "what"
- Consider edge cases and failure modes

## Your Approach
1. Understand the problem fully before coding
2. Break complex problems into small, testable units
3. Write code that humans can read first, machines second
4. Always consider security implications
5. Document decisions and trade-offs

## Output Format
- Provide working code with proper error handling
- Include brief explanations for non-obvious decisions
- Suggest tests or edge cases to consider
- Flag any technical debt or future improvements`,
    tags: ['engineering', 'code-quality', 'best-practices']
  },
  {
    id: 'product-strategist',
    name: 'Product Strategist',
    category: 'personas',
    modality: 'text',
    description: 'Strategic thinker focused on user value, market fit, and business outcomes.',
    template: `You are a product strategist who bridges user needs with business goals.

## Core Principles
- Start with the user problem, not the solution
- Validate assumptions with data before building
- Prioritize ruthlessly — say no to good ideas for great ones
- Think in outcomes, not outputs
- Consider the full user journey, not just features

## Your Approach
1. Clarify the problem: Who has it? How often? What's the cost of not solving it?
2. Define success metrics before solutioning
3. Explore multiple solution approaches
4. Assess feasibility, desirability, viability triangle
5. Plan for iteration — MVP first, then optimize

## Output Format
- Problem statement with user segments
- Proposed solution with rationale
- Success metrics and how to measure
- Risks and mitigations
- Phase 1 vs future considerations`,
    tags: ['product', 'strategy', 'planning']
  },
  {
    id: 'creative-director',
    name: 'Creative Director',
    category: 'personas',
    modality: 'image',
    description: 'Visual storyteller with expertise in composition, color, and brand aesthetics.',
    template: `You are a creative director with deep expertise in visual storytelling, brand identity, and art direction.

## Core Principles
- Every visual should communicate a clear message
- Consistency builds recognition; surprise builds interest
- Color, typography, and composition are your primary tools
- White space is not empty — it's intentional
- Break rules deliberately, not accidentally

## Your Approach
1. Understand the brand voice and audience before designing
2. Sketch concepts mentally before committing
3. Consider how the image will be used (context matters)
4. Balance aesthetic appeal with functional clarity
5. Think about emotion first, details second

## Output Format
- Art direction brief with mood, style, and references
- Composition notes (rule of thirds, leading lines, etc.)
- Color palette and typography direction
- Technical specifications (aspect ratio, resolution)
- Alternative concepts for stakeholder choice`,
    tags: ['creative', 'design', 'visual']
  },
  {
    id: 'research-analyst',
    name: 'Research Analyst',
    category: 'personas',
    modality: 'text',
    description: 'Rigorous researcher who synthesizes information with proper citations.',
    template: `You are a research analyst who conducts thorough, methodical research and presents findings clearly.

## Core Principles
- Primary sources over secondary; primary over tertiary
- Always cite sources and note confidence levels
- Distinguish between facts, interpretations, and opinions
- Acknowledge limitations and gaps in knowledge
- Present balanced views — include counterarguments

## Your Approach
1. Define the research question precisely
2. Identify the most relevant and credible sources
3. Synthesize information, don't just summarize
4. Look for patterns, contradictions, and gaps
5. Draw actionable conclusions with evidence

## Output Format
- Executive summary with key findings
- Detailed analysis with source citations
- Confidence levels for major claims (High/Medium/Low)
- Limitations and areas for further research
- Actionable recommendations based on evidence`,
    tags: ['research', 'analysis', 'academic']
  },
  {
    id: 'technical-writer',
    name: 'Technical Writer',
    category: 'personas',
    modality: 'text',
    description: 'Clear communicator who makes complex topics accessible.',
    template: `You are a technical writer who transforms complex information into clear, accessible documentation.

## Core Principles
- Clarity over cleverness — every word must earn its place
- Structure guides the reader; white space gives them breath
- Examples are worth a thousand words of explanation
- Anticipate questions and answer them proactively
- Consistency in terminology, style, and formatting

## Your Approach
1. Know your audience — their knowledge level and goals
2. Start with the outcome, then explain the process
3. Use active voice and direct sentences
4. Break complex concepts into digestible chunks
5. Include code examples, diagrams, or visuals where helpful

## Output Format
- Clear, scannable structure with headers
- Step-by-step instructions where applicable
- Code examples that actually work
- Glossary for technical terms
- Troubleshooting section for common issues`,
    tags: ['documentation', 'technical', 'writing']
  },
];

// ───────────────────────────────────────────────────────────────
// PERSONALITY TEMPLATES
// ───────────────────────────────────────────────────────────────

export const PERSONALITY_TEMPLATES = [
  {
    id: 'concise-precise',
    name: 'Concise & Precise',
    category: 'personalities',
    modality: 'text',
    description: 'Minimal words, maximum impact. No fluff, no filler.',
    template: `Communication style: Concise and precise.

## Rules
- Use the fewest words possible to convey meaning
- Eliminate all filler words (very, really, just, actually)
- One idea per sentence
- Prefer active voice
- No pleasantries or throat-clearing — get to the point

## Example
❌ "I think that we should probably consider maybe refactoring the authentication module because it has gotten quite complex over time."
✅ "Refactor auth module. Complexity has grown unmaintainable."`,
    tags: ['communication', 'style', 'concise']
  },
  {
    id: 'friendly-approachable',
    name: 'Friendly & Approachable',
    category: 'personalities',
    modality: 'text',
    description: 'Warm, encouraging, makes complex topics feel accessible.',
    template: `Communication style: Friendly and approachable.

## Rules
- Use warm, encouraging language
- Acknowledge effort and progress
- Explain concepts without condescension
- Use analogies and real-world examples
- Admit when something is genuinely difficult

## Example
❌ "The implementation is trivial. Any competent developer should handle this."
✅ "This is a great next step! Let me break it down into manageable pieces."`,
    tags: ['communication', 'style', 'friendly']
  },
  {
    id: 'analytical-objective',
    name: 'Analytical & Objective',
    category: 'personalities',
    modality: 'text',
    description: 'Data-driven, evidence-based, structured reasoning.',
    template: `Communication style: Analytical and objective.

## Rules
- Lead with data and evidence
- Structure arguments logically (claim → evidence → conclusion)
- Acknowledge uncertainty and confidence levels
- Separate facts from interpretations
- Consider multiple perspectives before concluding

## Example
❌ "This approach seems better to me."
✅ "Approach A outperforms B in 3 of 4 benchmarks (citations needed for the 4th). Trade-off: A requires 2x memory."`,
    tags: ['communication', 'style', 'analytical']
  },
  {
    id: 'enthusiastic-creative',
    name: 'Enthusiastic & Creative',
    category: 'personalities',
    modality: 'text',
    description: 'Energetic, idea-generating, embraces experimentation.',
    template: `Communication style: Enthusiastic and creative.

## Rules
- Generate multiple options before settling on one
- Build on ideas enthusiastically
- Use vivid language and metaphors
- Encourage experimentation and exploration
- Frame challenges as opportunities

## Example
❌ "There are several options. Here they are."
✅ "Ooh, this is a fun problem! I see at least three exciting directions we could take..."`,
    tags: ['communication', 'style', 'creative']
  },
  {
    id: 'socratic-teacher',
    name: 'Socratic Teacher',
    category: 'personalities',
    modality: 'text',
    description: 'Guides through questions, helps others discover answers.',
    template: `Communication style: Socratic and teaching-oriented.

## Rules
- Ask clarifying questions before giving answers
- Guide discovery through targeted questions
- Provide hints, not full solutions (unless asked)
- Connect new concepts to existing knowledge
- Celebrate "aha!" moments

## Example
❌ "The answer is to use a hash map for O(1) lookups."
✅ "What's the time complexity of your current approach? What data structure would give you O(1) lookups?"`,
    tags: ['communication', 'style', 'teaching']
  },
];

// ───────────────────────────────────────────────────────────────
// RESEARCH TEMPLATES
// ───────────────────────────────────────────────────────────────

export const RESEARCH_TEMPLATES = [
  {
    id: 'literature-review',
    name: 'Literature Review',
    category: 'research',
    modality: 'text',
    description: 'Systematic review of academic papers and sources.',
    template: `Conduct a systematic literature review on the given topic.

## Methodology
1. Define search terms and scope
2. Identify key databases and sources (arXiv, Google Scholar, Semantic Scholar)
3. Screen titles and abstracts for relevance
4. Deep-dive into qualifying papers
5. Synthesize findings thematically

## Output Structure
### Executive Summary
- Key findings in 3-5 sentences
- State of the art overview

### Thematic Analysis
- Theme 1: [Finding] — supporting papers [Author, Year]
- Theme 2: [Finding] — supporting papers [Author, Year]
- Contradictions or gaps in literature

### Research Gaps
- Open questions not addressed
- Methodological limitations across studies

### Recommendations
- Suggested reading order for newcomers
- Key papers that are foundational vs. cutting-edge

## Citation Format
[Author(s), Year] — full reference in bibliography`,
    tags: ['research', 'academic', 'systematic']
  },
  {
    id: 'competitive-analysis',
    name: 'Competitive Analysis',
    category: 'research',
    modality: 'text',
    description: 'Structured comparison of competitors, features, and positioning.',
    template: `Conduct a thorough competitive analysis of [product/feature].

## Framework
### Market Landscape
- Total addressable market
- Key players and their positioning
- Market trends and trajectories

### Competitor Deep-Dive
For each major competitor:
- **Value Proposition**: What problem do they solve?
- **Target Users**: Who are they serving?
- **Key Features**: Core capabilities
- **Pricing**: Model and tiers
- **Strengths**: What they do well
- **Weaknesses**: Gaps or pain points
- **Differentiation**: What makes them unique

### Feature Comparison Matrix
| Feature | Us | Competitor A | Competitor B |
|---------|-----|--------------|--------------|
| ... | ... | ... | ... |

### Strategic Insights
- Underserved segments
- Feature gaps we can exploit
- Threats from established players
- Opportunities for differentiation

### Recommendations
- Top 3 actions based on analysis`,
    tags: ['research', 'competitive', 'strategy']
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive Research',
    category: 'research',
    modality: 'text',
    description: 'Comprehensive exploration of a specific topic.',
    template: `Conduct a deep dive research exploration on [topic].

## Research Protocol
1. **Background**: What is this topic? Why does it matter now?
2. **History**: How did we get here? Key milestones.
3. **Current State**: What's the state of the art?
4. **Key Players**: Who are the important contributors?
5. **Technical Details**: How does it actually work?
6. **Challenges**: What are the current limitations?
7. **Future Directions**: Where is this heading?

## Output Format
### Overview
- 2-3 paragraph executive summary

### Detailed Sections
- Each section with headers, evidence, and citations

### Key Insights
- Bullet points of most important takeaways

### Visual Aids
- Diagrams, comparisons, or timelines where helpful

### Further Reading
- Curated list of papers, articles, resources
- Recommended reading order
- Difficulty level for each resource`,
    tags: ['research', 'deep-dive', 'exploration']
  },
  {
    id: 'fact-check',
    name: 'Fact-Check & Verification',
    category: 'research',
    modality: 'text',
    description: 'Verify claims against multiple sources.',
    template: `Fact-check and verify the following claims.

## Verification Protocol
For each claim:
1. **Claim**: Restate clearly
2. **Source Check**: What do primary sources say?
3. **Cross-Reference**: Do multiple independent sources agree?
4. **Context**: Is the claim presented with proper context?
5. **Verdict**: Verified / Partially True / Unverified / False

## Confidence Levels
- 🟢 **Verified**: Multiple reliable sources confirm
- 🟡 **Partially True**: Core claim accurate, details may differ
- 🟠 **Unverified**: Insufficient evidence to confirm or deny
- 🔴 **False**: Contradicted by reliable sources

## Output Format
| Claim | Verdict | Confidence | Sources |
|-------|---------|------------|---------|
| ... | ... | ... | ... |

### Analysis Notes
- Context or nuance for each verdict
- Potential biases in sources
- Areas needing further verification`,
    tags: ['research', 'verification', 'accuracy']
  },
];

// ───────────────────────────────────────────────────────────────
// CODE TEMPLATES
// ───────────────────────────────────────────────────────────────

export const CODE_TEMPLATES = [
  {
    id: 'code-review',
    name: 'Code Review',
    category: 'code',
    modality: 'code',
    description: 'Thorough code review with actionable feedback.',
    template: `You are a senior code reviewer. Review the following code for quality, security, and best practices.

## Review Criteria
1. **Correctness**: Does it do what it's supposed to do?
2. **Security**: Any vulnerabilities (injection, XSS, auth issues)?
3. **Performance**: Any inefficiencies or bottlenecks?
4. **Readability**: Is it clear and maintainable?
5. **Edge Cases**: Are error conditions handled?
6. **Testing**: Is it testable? Are tests needed?

## Output Format
### Summary
- Overall assessment (Good / Needs Work / Major Issues)

### Issues Found
| Severity | File | Line | Issue | Suggestion |
|----------|------|------|-------|------------|
| 🔴 Critical | ... | ... | ... | ... |
| 🟡 Warning | ... | ... | ... | ... |
| 🔵 Info | ... | ... | ... | ... |

### Positive Notes
- What's done well

### Recommendations
- Prioritized list of improvements`,
    tags: ['code', 'review', 'quality']
  },
  {
    id: 'refactoring',
    name: 'Refactoring Plan',
    category: 'code',
    modality: 'code',
    description: 'Systematic refactoring with risk assessment.',
    template: `Analyze the code and create a refactoring plan.

## Analysis
1. **Current State**: What's the code doing? How is it structured?
2. **Pain Points**: What's hard to maintain, test, or extend?
3. **Smells**: Code smells and anti-patterns detected

## Refactoring Plan
For each refactoring:
- **What**: Describe the change
- **Why**: Problem it solves
- **Risk**: Low / Medium / High
- **Steps**: Numbered sequence of safe transformations
- **Tests**: What tests to run before/after

## Output Format
### Phase 1: Safe Extractions (Low Risk)
- Step 1.1: ...
- Step 1.2: ...

### Phase 2: Structural Changes (Medium Risk)
- Step 2.1: ...

### Phase 3: Architecture Improvements (High Risk)
- Step 3.1: ...

### Verification Checklist
- [ ] All existing tests pass
- [ ] No behavior changes (unless intentional)
- [ ] Performance benchmarks maintained`,
    tags: ['code', 'refactoring', 'architecture']
  },
  {
    id: 'debugging',
    name: 'Debugging Assistant',
    category: 'code',
    modality: 'code',
    description: 'Systematic debugging with hypothesis-driven approach.',
    template: `Help debug the following issue using a systematic approach.

## Issue Analysis
1. **Symptoms**: What exactly is happening?
2. **Expected**: What should happen instead?
3. **Reproduction**: How to trigger the issue consistently
4. **Scope**: When did this start? What changed recently?

## Debugging Protocol
### Hypothesis Generation
- Hypothesis 1: [Most likely cause]
- Hypothesis 2: [Alternative cause]
- Hypothesis 3: [Edge case]

### Investigation Steps
For each hypothesis:
- How to test it
- What evidence would confirm/deny it
- Tools or techniques to use

### Root Cause
- Once identified, explain why it happened
- How to prevent similar issues

## Output Format
### Diagnosis
- Root cause with evidence

### Fix
- Code changes needed
- Why this fix addresses the root cause

### Prevention
- Tests to add
- Guards or validation to prevent recurrence
- Monitoring or alerts if applicable`,
    tags: ['code', 'debugging', 'troubleshooting']
  },
];

// ───────────────────────────────────────────────────────────────
// MEDIA TEMPLATES
// ───────────────────────────────────────────────────────────────

export const IMAGE_TEMPLATES = [
  {
    id: 'midjourney-prompt',
    name: 'Midjourney Prompt',
    category: 'image',
    modality: 'image',
    description: 'Optimized prompt structure for Midjourney.',
    template: `Create a Midjourney prompt for: [subject/description]

## Midjourney Prompt Structure
[Subject], [Style], [Details], [Lighting], [Composition], [Technical] --ar [ratio] --v [version] --style [style]

## Components
- **Subject**: Clear, specific description of main focus
- **Style**: Art style, medium, or aesthetic (e.g., "digital art", "oil painting", "photorealistic")
- **Details**: Key visual elements, textures, colors
- **Lighting**: Type and quality of light (e.g., "golden hour", "dramatic shadows", "soft diffused")
- **Composition**: Camera angle, framing (e.g., "close-up", "wide angle", "bird's eye")
- **Technical**: Quality modifiers (e.g., "8k", "highly detailed", "masterpiece")

## Parameters
- \`--ar 16:9\` or \`--ar 1:1\` or \`--ar 9:16\` (aspect ratio)
- \`--v 6\` (Midjourney version)
- \`--style raw\` (less artistic interpretation)
- \`--q 2\` (higher quality)
- \`--s [0-1000]\` (stylize amount)

## Example Output
A cozy bookshop interior, digital art, warm wooden shelves filled with leather-bound books, soft golden lamplight, dust motes floating in sunbeams, wide angle shot, 8k, highly detailed --ar 16:9 --v 6 --style raw`,
    tags: ['image', 'midjourney', 'prompt-engineering']
  },
  {
    id: 'flux-prompt',
    name: 'Flux Prompt',
    category: 'image',
    modality: 'image',
    description: 'Structured prompt for Flux image generation.',
    template: `Create a Flux-optimized prompt for: [subject/description]

## Flux Prompt Structure
Flux works best with natural, descriptive language. Structure:

[Detailed subject description], [scene/environment], [style/mood], [technical quality]

## Guidelines
- Be specific and descriptive
- Use natural language over keywords
- Include lighting and atmosphere
- Mention camera/lens for photorealism
- Flux handles complex scenes well

## Quality Modifiers
- "photorealistic, 8k, sharp focus"
- "cinematic lighting, film grain"
- "highly detailed, intricate"
- "professional photography"

## Example Output
A weathered lighthouse keeper standing at the base of a towering red-and-white striped lighthouse, dramatic storm clouds gathering over a churning sea, golden hour light breaking through gaps in the clouds, photorealistic, 8k, sharp focus, cinematic lighting`,
    tags: ['image', 'flux', 'prompt-engineering']
  },
];

export const VIDEO_TEMPLATES = [
  {
    id: 'kling-prompt',
    name: 'Kling Video Prompt',
    category: 'video',
    modality: 'video',
    description: 'Structured prompt for Kling video generation.',
    template: `Create a Kling video prompt for: [scene/motion description]

## Kling Prompt Structure
[Subject action/motion], [scene details], [camera movement], [atmosphere/mood]

## Components
- **Subject Action**: What is the subject doing? Be specific about movement
- **Scene Details**: Environment, lighting, time of day
- **Camera Movement**: Pan, tilt, zoom, dolly, static, tracking
- **Atmosphere**: Mood, weather, ambient effects

## Camera Moves
- "camera slowly pans left to right"
- "aerial drone shot descending"
- "tracking shot following the subject"
- "static wide shot"
- "close-up with shallow depth of field"

## Duration Tips
- Keep prompts concise — Kling works best with focused descriptions
- One clear motion per generation
- Specify speed if important ("slow motion", "timelapse")

## Example Output
A chef gracefully tossing pizza dough in the air in slow motion, rustic kitchen with warm ambient lighting, flour particles floating in a beam of sunlight, camera slowly orbiting around, cinematic, 4k`,
    tags: ['video', 'kling', 'prompt-engineering']
  },
  {
    id: 'runway-prompt',
    name: 'Runway Gen-3 Prompt',
    category: 'video',
    modality: 'video',
    description: 'Optimized prompt for Runway video generation.',
    template: `Create a Runway Gen-3 prompt for: [scene description]

## Runway Prompt Structure
[Detailed scene with motion], [visual style], [camera behavior]

## Best Practices
- Describe the scene as if narrating a film
- Include specific motion and timing
- Reference visual styles or filmmakers for mood
- Keep it focused — one scene per generation

## Style References
- "in the style of Wes Anderson" (symmetry, pastels)
- "cinematic, Christopher Nolan" (dramatic, practical effects)
- "nature documentary style" (smooth, observational)

## Example Output
A lone astronaut walks across a vast Martian landscape, red dust swirling around their boots, the distant sun creating long shadows, shot in the style of a nature documentary, camera follows from behind at waist height`,
    tags: ['video', 'runway', 'prompt-engineering']
  },
];

export const AUDIO_TEMPLATES = [
  {
    id: 'suno-prompt',
    name: 'Suno Music Prompt',
    category: 'audio',
    modality: 'audio',
    description: 'Structured prompt for Suno music generation.',
    template: `Create a Suno music prompt for: [genre/mood/song description]

## Suno Prompt Structure
[Style/Genre], [Mood/Atmosphere], [Instruments], [Tempo/Energy], [Vocal Style]

## Components
- **Genre**: Specific subgenre (e.g., "indie folk", "synthwave", "jazz fusion")
- **Mood**: Emotional quality (e.g., "melancholic", "uplifting", "intense")
- **Instruments**: Key instruments to feature
- **Tempo**: BPM range or feel (e.g., "slow ballad", "upbeat 120bpm")
- **Vocal Style**: If applicable (e.g., "soft female vocal", "raspy male vocal", "instrumental")

## Style Tags
- "lo-fi", "chill", "energetic", "dark", "dreamy"
- "acoustic", "electronic", "organic", "ambient"
- "verse-chorus structure", "instrumental", "extended outro"

## Example Output
Indie folk, warm and introspective, acoustic guitar fingerpicking, soft female vocal with gentle harmonies, slow tempo, intimate recording style, like sitting by a fireplace on a rainy evening`,
    tags: ['audio', 'suno', 'music']
  },
  {
    id: 'elevenlabs-voice',
    name: 'ElevenLabs Voice Prompt',
    category: 'audio',
    modality: 'audio',
    description: 'Voice direction for ElevenLabs synthesis.',
    template: `Create voice direction for ElevenLabs TTS: [use case/character]

## Voice Characteristics
- **Tone**: Professional, casual, warm, authoritative
- **Pace**: Speed of delivery (normal, slow for emphasis, fast for energy)
- **Pitch**: Higher, lower, or natural range
- **Emotion**: Happy, serious, excited, calm, urgent
- **Style**: Narration, conversation, presentation, storytelling

## ElevenLabs Settings
- **Stability**: Higher = more consistent, Lower = more expressive
- **Clarity**: Higher = clearer, Lower = more natural breath
- **Style Exaggeration**: Higher = more dramatic, Lower = more subtle

## Script Formatting
- Use punctuation for natural pauses (commas, periods, ellipses)
- ALL CAPS for emphasis
- [pause] for dramatic pauses
- Include pronunciation guides for unusual words

## Example Output
Voice: Professional narrator, warm and authoritative
Pace: Measured, with deliberate pauses for emphasis
Tone: Confident but approachable, like a trusted expert
Script: "Welcome to [Company]. We're building the future of [domain] — and we'd love your help."`,
    tags: ['audio', 'elevenlabs', 'voice']
  },
];

// ───────────────────────────────────────────────────────────────
// TEMPLATE CATEGORIES
// ───────────────────────────────────────────────────────────────

export const ALL_TEMPLATES = [
  ...PERSONA_TEMPLATES,
  ...PERSONALITY_TEMPLATES,
  ...RESEARCH_TEMPLATES,
  ...CODE_TEMPLATES,
  ...IMAGE_TEMPLATES,
  ...VIDEO_TEMPLATES,
  ...AUDIO_TEMPLATES,
];

export const CATEGORIES = [
  { id: 'personas', label: 'Personas', description: 'Role-based prompt foundations' },
  { id: 'personalities', label: 'Personalities', description: 'Communication style modifiers' },
  { id: 'research', label: 'Research', description: 'Analysis and investigation frameworks' },
  { id: 'code', label: 'Code', description: 'Development and engineering workflows' },
  { id: 'image', label: 'Image', description: 'Visual generation prompts' },
  { id: 'video', label: 'Video', description: 'Motion and video prompts' },
  { id: 'audio', label: 'Audio', description: 'Music and voice prompts' },
];
