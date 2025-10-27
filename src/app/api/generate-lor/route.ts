import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Helper function to get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      applicantName,
      relationship,
      durationKnown,
      institution,
      targetProgram,
      targetInstitution,
      fieldDomain,
      observedQualities,
      achievements,
      softTraits,
      anecdote,
      referrerName,
      referrerTitle,
      referrerEmail,
      tone,
      lorType,
      recommendationStrength,
    } = body;

    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured', code: 'API_KEY_MISSING' },
        { status: 500 }
      );
    }

    // Build the prompt based on the form data
    const prompt = `Generate an exceptionally detailed and comprehensive Letter of Recommendation suitable for TOP-TIER INSTITUTIONS (Ivy League schools, IITs, NITs, and other elite universities). This letter must demonstrate exceptional depth, specificity, and professionalism.

APPLICANT INFORMATION:
- Name: ${applicantName}
- Target Program/Role: ${targetProgram}
- Target Institution: ${targetInstitution}
- Field/Domain: ${fieldDomain}

REFERRER INFORMATION:
- Referrer Name: ${referrerName}
- Title/Position: ${referrerTitle}
- Email: ${referrerEmail}
- Institution/Company: ${institution}
- Relationship to Applicant: ${relationship}
- Duration Known: ${durationKnown}

APPLICANT QUALITIES:
- Observed Qualities: ${observedQualities}
- Specific Achievements: ${achievements}
- Soft Skills/Character: ${softTraits}
${anecdote ? `- Notable Anecdote/Example: ${anecdote}` : ''}

LETTER SPECIFICATIONS:
- Tone: ${tone}
- Letter Type: ${lorType}
- Recommendation Strength: ${recommendationStrength}

CRITICAL REQUIREMENTS FOR TOP-TIER INSTITUTION APPLICATIONS:

1. **COMPREHENSIVE STRUCTURE** - Include ALL of these sections with substantial detail:
   - Professional letterhead format with referrer's complete credentials
   - Formal salutation addressing admissions committee
   - Strong opening paragraph establishing credibility and context of relationship
   - 3-4 detailed body paragraphs covering:
     * Academic excellence and intellectual curiosity (with specific examples)
     * Research capabilities, technical skills, and domain expertise
     * Leadership qualities and collaborative abilities
     * Character, integrity, and personal qualities
     * Specific projects, achievements, and measurable outcomes
   - Comparative assessment (e.g., "top 1-5% of students I've worked with")
   - Strong closing with unequivocal endorsement
   - Professional signature block

2. **DEPTH AND SPECIFICITY** - Each quality mentioned must include:
   - Concrete examples from real situations
   - Specific metrics, numbers, or outcomes where applicable
   - Context showing why this achievement is significant
   - Evidence of growth, learning, or exceptional capability
   - Detailed observations that go beyond generic praise

3. **INTELLECTUAL RIGOR** - Demonstrate the applicant's:
   - Analytical and critical thinking abilities with specific instances
   - Problem-solving approach with detailed examples
   - Innovation and creativity in their field
   - Depth of subject matter knowledge
   - Research methodology and scientific temperament (if applicable)
   - Ability to grasp complex concepts and contribute original ideas

4. **ACADEMIC EXCELLENCE** - Detail:
   - Performance in coursework with specific subjects/projects
   - Quality of academic work (papers, presentations, exams)
   - Intellectual engagement beyond requirements
   - Contribution to classroom discussions and peer learning
   - Academic rankings or distinctions (if mentioned in achievements)

5. **PERSONAL QUALITIES FOR ELITE INSTITUTIONS** - Elaborate on:
   - Resilience and ability to handle academic pressure
   - Collaboration and teamwork with diverse groups
   - Leadership potential and demonstrated leadership instances
   - Communication skills (written and verbal)
   - Cultural awareness and global perspective
   - Ethical foundation and integrity
   - Passion and genuine interest in their field

6. **COMPARATIVE CONTEXT** - Provide:
   - Comparison to peer group with specific percentile ranking
   - Reference to referrer's experience (years, number of students)
   - Unique qualities that distinguish the applicant
   - Readiness for the rigor of top-tier institutions

7. **TONE AND STYLE** - The letter must be:
   - ${tone} throughout while maintaining professionalism
   - Persuasive and compelling without being hyperbolic
   - Balanced with honest assessment and strong endorsement
   - Written in a sophisticated, articulate manner befitting ${referrerTitle}
   - Free of clichés and generic statements
   - Specific to ${lorType} context

8. **LENGTH AND DETAIL** - Generate 700-900 words:
   - Each paragraph should be substantial (100-150 words)
   - No generic filler - every sentence adds value
   - Rich in specific details, examples, and observations
   - Comprehensive coverage of all key aspects

9. **PROFESSIONALISM** - Ensure:
   - Perfect grammar, spelling, and punctuation
   - Appropriate academic/professional vocabulary
   - Formal letter format with date and addresses
   - Proper closing (e.g., "Sincerely," "Respectfully,")
   - Complete signature block with contact information

10. **AUTHENTICITY AND CREDIBILITY** - The letter should:
    - Sound genuine and written by someone who knows the applicant well
    - Include specific time references and contextual details
    - Show nuanced understanding of the applicant's journey
    - Provide verifiable claims and specific instances
    - Reflect the ${durationKnown} duration of observation

IMPORTANT INSTRUCTIONS:
- Use the provided information creatively to construct detailed, specific examples
- Elaborate extensively on each quality mentioned
- Weave in the anecdote naturally if provided
- Make the ${recommendationStrength} recommendation clear and compelling
- Tailor specifically for ${targetProgram} at ${targetInstitution}
- Emphasize qualities valued by top-tier institutions: intellectual vitality, leadership, impact, character
- Generate ONLY the letter content - no meta-commentary, no explanations, no bullet points
- The letter should be ready to print and submit as-is

Generate a letter that would stand out in the competitive applicant pool of the world's most selective institutions.`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to generate letter',
          code: 'GENERATION_ERROR',
          details: errorData,
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate content';

    return NextResponse.json({ content: generatedText }, { status: 200 });
  } catch (error) {
    console.error('Generate LOR error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}