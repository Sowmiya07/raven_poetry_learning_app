import { Poem, PoemFeedback } from '../types';

// Simulate AI feedback service
export async function getFeedbackForPoem(poem: Poem): Promise<PoemFeedback> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock feedback based on poem characteristics
  const wordCount = poem.content.split(/\s+/).length;
  const lineCount = poem.content.split('\n').length;
  const hasRhyme = checkForRhyme(poem.content);
  const hasMetaphor = checkForMetaphor(poem.content);
  
  let score = 5; // Base score
  const strengths: string[] = [];
  const suggestions: string[] = [];

  // Analyze word count
  if (wordCount > 50) {
    score += 1;
    strengths.push("Rich vocabulary and detailed imagery");
  } else if (wordCount < 20) {
    suggestions.push("Consider expanding with more descriptive language");
  }

  // Analyze structure
  if (lineCount > 8) {
    score += 1;
    strengths.push("Well-structured with multiple stanzas");
  } else {
    suggestions.push("Try experimenting with different stanza structures");
  }

  // Check for poetic devices
  if (hasRhyme) {
    score += 1;
    strengths.push("Effective use of rhyme scheme");
  } else {
    suggestions.push("Consider adding some rhyming elements or internal rhyme");
  }

  if (hasMetaphor) {
    score += 1;
    strengths.push("Creative use of metaphorical language");
  } else {
    suggestions.push("Try incorporating metaphors or similes for deeper imagery");
  }

  // Theme-specific feedback
  if (poem.theme.toLowerCase().includes('nature')) {
    if (poem.content.toLowerCase().includes('seasons') || 
        poem.content.toLowerCase().includes('trees') ||
        poem.content.toLowerCase().includes('wind')) {
      score += 1;
      strengths.push("Vivid natural imagery that connects with the theme");
    }
  }

  // Ensure score is within bounds
  score = Math.min(10, Math.max(3, score));

  const overall = generateOverallFeedback(score, poem.theme);

  return {
    score,
    strengths,
    suggestions,
    overall,
  };
}

function checkForRhyme(content: string): boolean {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 2) return false;
  
  // Simple rhyme detection - check if last words of lines end similarly
  const lastWords = lines.map(line => {
    const words = line.trim().split(/\s+/);
    return words[words.length - 1].toLowerCase().replace(/[^\w]/g, '');
  });

  for (let i = 0; i < lastWords.length - 1; i++) {
    for (let j = i + 1; j < lastWords.length; j++) {
      if (lastWords[i].length > 2 && lastWords[j].length > 2) {
        const ending1 = lastWords[i].slice(-2);
        const ending2 = lastWords[j].slice(-2);
        if (ending1 === ending2) return true;
      }
    }
  }
  
  return false;
}

function checkForMetaphor(content: string): boolean {
  const metaphorIndicators = [
    'like', 'as', 'is', 'was', 'becomes', 'transformed',
    'resembles', 'mirrors', 'echoes', 'whispers', 'dances'
  ];
  
  return metaphorIndicators.some(indicator => 
    content.toLowerCase().includes(indicator)
  );
}

function generateOverallFeedback(score: number, theme: string): string {
  const feedbackTemplates = {
    high: [
      `This is a beautifully crafted poem that effectively captures the essence of ${theme.toLowerCase()}. Your imagery is vivid and your emotional connection to the subject shines through.`,
      `Excellent work! Your poem demonstrates strong technical skill and genuine artistic expression. The theme of ${theme.toLowerCase()} is explored with depth and creativity.`,
      `This poem shows sophisticated use of language and poetic devices. You've created something truly moving that resonates with the ${theme.toLowerCase()} theme.`
    ],
    medium: [
      `A solid poem with good potential. Your exploration of ${theme.toLowerCase()} shows promise, and with some refinement, this could become even more powerful.`,
      `This poem has several strong moments and shows your understanding of the ${theme.toLowerCase()} theme. Focus on strengthening the imagery and rhythm for greater impact.`,
      `You've created a meaningful piece that touches on ${theme.toLowerCase()} effectively. Consider working on the flow and adding more sensory details to enhance the reader's experience.`
    ],
    low: [
      `This is a good starting point for exploring ${theme.toLowerCase()}. Poetry is a craft that improves with practice, so keep writing and experimenting with different techniques.`,
      `You've taken the first important step in expressing your thoughts about ${theme.toLowerCase()}. Focus on developing your unique voice and don't be afraid to take creative risks.`,
      `Every poet starts somewhere, and this poem shows your willingness to engage with the theme of ${theme.toLowerCase()}. Keep writing regularly and study poems you admire.`
    ]
  };

  let category: keyof typeof feedbackTemplates;
  if (score >= 8) category = 'high';
  else if (score >= 6) category = 'medium';
  else category = 'low';

  const templates = feedbackTemplates[category];
  return templates[Math.floor(Math.random() * templates.length)];
}