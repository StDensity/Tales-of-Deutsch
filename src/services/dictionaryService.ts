// Cache for storing previously looked up words
const cache: Record<string, any> = {};

export async function getWordDefinition(word: string): Promise<any> {
  // Remove any punctuation and convert to lowercase
  const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
  
  // Check cache first
  if (cache[cleanWord]) {
    return cache[cleanWord];
  }
  
  try {
    // Use Wiktionary API which has better German support
    const response = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(cleanWord)}`
    );
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    
    // Store in cache
    cache[cleanWord] = data;
    
    return data;
  } catch (error) {
    console.error('Error fetching word definition:', error);
    return null;
  }
}

// For pronunciation, we'll use the audio from Wiktionary
export async function getWordPronunciation(word: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/media/${encodeURIComponent(word)}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    // Find audio files
    const audioFile = data.items?.find((item: any) => 
      item.type === 'audio' && 
      (item.title.endsWith('.ogg') || item.title.endsWith('.mp3'))
    );
    
    return audioFile?.url || null;
  } catch (error) {
    console.error('Error fetching pronunciation:', error);
    return null;
  }
}

// Process Wiktionary definition data
export function processWiktionaryData(data: any): any {
  if (!data) return null;
  
  // Try to get German definitions first
  const germanDefs = data.de;
  if (germanDefs && germanDefs.length > 0) {
    return {
      language: 'German',
      definitions: germanDefs.map((def: any) => ({
        partOfSpeech: def.partOfSpeech,
        meanings: def.definitions.map((meaning: any) => ({
          definition: stripHtml(meaning.definition),
          examples: meaning.examples ? meaning.examples.map(stripHtml) : [],
          translations: meaning.parsedExamples ? meaning.parsedExamples.map((ex: any) => ({
            example: stripHtml(ex.example),
            translation: stripHtml(ex.translation)
          })) : []
        }))
      }))
    };
  }
  
  // Fall back to English if no German definitions
  const englishDefs = data.en;
  if (englishDefs && englishDefs.length > 0) {
    return {
      language: 'English',
      definitions: englishDefs.map((def: any) => ({
        partOfSpeech: def.partOfSpeech,
        meanings: def.definitions.map((meaning: any) => ({
          definition: stripHtml(meaning.definition),
          examples: meaning.examples ? meaning.examples.map(stripHtml) : [],
          translations: meaning.parsedExamples ? meaning.parsedExamples.map((ex: any) => ({
            example: stripHtml(ex.example),
            translation: stripHtml(ex.translation)
          })) : []
        }))
      }))
    };
  }
  
  return null;
}

// Helper function to strip HTML from text
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}