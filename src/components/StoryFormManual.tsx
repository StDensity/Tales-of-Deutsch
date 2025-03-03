import { cefrLevelEnum } from "@/db/schema";
import { Category, ParagraphInput } from "@/types/story";

interface StoryFormManualProps {
   title: string;
   setTitle: (title: string) => void;
   level: string;
   setLevel: (level: string) => void;
   isCommunity: boolean;
   setIsCommunity: (isCommunity: boolean) => void;
   categories: Category[];
   selectedCategories: number[];
   handleCategoryChange: (categoryId: number) => void;
   paragraphs: ParagraphInput[];
   setParagraphs: (paragraphs: ParagraphInput[]) => void;
}

export default function StoryFormManual({
   title,
   setTitle,
   level,
   setLevel,
   isCommunity,
   setIsCommunity,
   categories,
   selectedCategories,
   handleCategoryChange,
   paragraphs,
   setParagraphs,
}: StoryFormManualProps) {
   const handleParagraphChange = (
      index: number,
      field: "german" | "english",
      value: string
   ) => {
      const updatedParagraphs = [...paragraphs];
      updatedParagraphs[index][field] = value;
      setParagraphs(updatedParagraphs);
   };

   const addParagraph = () => {
      setParagraphs([...paragraphs, { german: "", english: "" }]);
   };

   const removeParagraph = (index: number) => {
      if (paragraphs.length > 1) {
         const updatedParagraphs = paragraphs.filter((_, i) => i !== index);
         setParagraphs(updatedParagraphs);
      }
   };

   const cefrLevels = cefrLevelEnum.enumValues;

   return (
      <div className="space-y-6">
         <div>
            <label htmlFor="title" className="block mb-2 font-medium">
               Story Title
            </label>
            <input
               type="text"
               id="title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               required
               className="w-full p-2 border border-gray-300 rounded-md bg-background"
            />
         </div>

         <div>
            <label htmlFor="level" className="block mb-2 font-medium">
               CEFR Level
            </label>
            <select
               id="level"
               value={level}
               onChange={(e) => setLevel(e.target.value)}
               required
               className="w-full p-2 border border-gray-300 rounded-md bg-background"
            >
               {cefrLevels.map((levelOption) => (
                  <option key={levelOption} value={levelOption}>
                     {levelOption}
                  </option>
               ))}
            </select>
         </div>

         <div>
            <label className="block mb-2 font-medium">Story Type</label>
            <div className="flex items-center">
               <input
                  type="checkbox"
                  id="isCommunity"
                  checked={isCommunity}
                  onChange={(e) => setIsCommunity(e.target.checked)}
                  className="mr-2 h-4 w-4"
               />
               <label htmlFor="isCommunity">
                  Community Story (visible to all users)
               </label>
            </div>
         </div>

         <div>
            <label className="block mb-2 font-medium">Categories</label>
            <div className="grid grid-cols-2 gap-2">
               {categories.length > 0 ? (
                  categories.map((category) => (
                     <div key={category.id} className="flex items-center">
                        <input
                           type="checkbox"
                           id={`category-${category.id}`}
                           checked={selectedCategories.includes(category.id)}
                           onChange={() => handleCategoryChange(category.id)}
                           className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={`category-${category.id}`}>
                           {category.name}
                        </label>
                     </div>
                  ))
               ) : (
                  <p className="text-text-secondary">No categories available</p>
               )}
            </div>
         </div>

         <div>
            <h2 className="text-xl font-medium mb-4">Paragraphs</h2>
            {paragraphs.map((paragraph, index) => (
               <div
                  key={index}
                  className="mb-8 p-4 border border-gray-200 rounded-md"
               >
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-medium">Paragraph {index + 1}</h3>
                     <button
                        type="button"
                        onClick={() => removeParagraph(index)}
                        disabled={paragraphs.length <= 1}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                     >
                        Remove
                     </button>
                  </div>

                  <div className="mb-4">
                     <label htmlFor={`german-${index}`} className="block mb-2">
                        German Text
                     </label>
                     <textarea
                        id={`german-${index}`}
                        value={paragraph.german}
                        onChange={(e) =>
                           handleParagraphChange(
                              index,
                              "german",
                              e.target.value
                           )
                        }
                        required
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md bg-background"
                     />
                  </div>

                  <div>
                     <label htmlFor={`english-${index}`} className="block mb-2">
                        English Translation
                     </label>
                     <textarea
                        id={`english-${index}`}
                        value={paragraph.english}
                        onChange={(e) =>
                           handleParagraphChange(
                              index,
                              "english",
                              e.target.value
                           )
                        }
                        required
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md bg-background"
                     />
                  </div>
               </div>
            ))}

            <button
               type="button"
               onClick={addParagraph}
               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
               Add Paragraph
            </button>
         </div>
      </div>
   );
}
