import React from "react";
import { ResumeType } from 'types/types';

interface FontSelectorProps {
  resume: ResumeType;
  fonts: { id: string; label: string; preview: string }[];
  selectedFont: string;
  onSelect: (fontId: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ resume, fonts, selectedFont, onSelect }) => {
  return (
    <div className="p-2 grid grid-cols-2 md:grid-cols-3 gap-4">
      {fonts.map((font) => (
        <div
          key={font.id}
          className={`relative border-2 rounded-lg cursor-pointer transition-shadow duration-200 p-4 ${
            selectedFont === font.id ? 'ring-4 ring-blue-500 border-blue-500' : 'hover:shadow-lg border-gray-300'
          }`}
          onClick={() => onSelect(font.id)}
          style={{ background: '#f9f9f9' }}
        >
          <div className="flex flex-col items-center">
            <div 
              className="text-2xl font-bold mb-2 text-center"
              style={{ fontFamily: font.preview }}
            >
              {font.label}
            </div>
            <div 
              className="text-sm text-gray-600 text-center"
              style={{ fontFamily: font.preview }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          {selectedFont === font.id && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-lg flex items-center justify-center pointer-events-none">
              <span className="text-white font-bold text-lg">Selected</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FontSelector; 