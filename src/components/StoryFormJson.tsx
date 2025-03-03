import { useState } from 'react';
import { ParagraphInput } from '@/types/story';

interface StoryFormJsonProps {
  setTitle: (title: string) => void;
  setLevel: (level: string) => void;
  setIsCommunity: (isCommunity: boolean) => void;
  setSelectedCategories: (categories: number[]) => void;
  setParagraphs: (paragraphs: ParagraphInput[]) => void;
}

export default function StoryFormJson({
  setTitle,
  setLevel,
  setIsCommunity,
  setSelectedCategories,
  setParagraphs,
}: StoryFormJsonProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleJsonSubmit = () => {
    try {
      const data = JSON.parse(jsonInput);
      
      // Validate and set the data
      if (!data.title || !data.level || !data.paragraphs) {
        throw new Error('Missing required fields: title, level, or paragraphs');
      }

      setTitle(data.title);
      setLevel(data.level);
      setIsCommunity(data.isCommunity ?? true);
      setSelectedCategories(data.categoryIds ?? []);
      
      // Map paragraphs with proper typing
      const typedParagraphs: ParagraphInput[] = data.paragraphs.map((p: any, index: number) => ({
        german: p.german,
        english: p.english,
      }));
      
      setParagraphs(typedParagraphs);
      setError('');
    } catch (err) {
      setError('Invalid JSON format or missing required fields');
      console.error('Error parsing JSON:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">
          Paste your JSON here
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-background h-96 font-mono"
          placeholder="Paste your JSON here..."
        />
      </div>

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleJsonSubmit}
        className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80"
      >
        Parse JSON
      </button>
    </div>
  );
}