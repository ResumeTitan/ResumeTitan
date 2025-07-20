import React from "react";
import ResumeContainer from 'templates/ResumeContainer';
import { ResumeType } from 'types/types';

interface ThemeSelectorProps {
  resume: ResumeType;
  themes: { id: string; label: string }[];
  selectedTheme: string;
  onSelect: (themeId: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ resume, themes, selectedTheme, onSelect }) => {
  return (
    <div className="p-2 grid grid-cols-2 md:grid-cols-3 gap-4">
      {themes.map((theme) => {
        const previewResume = { ...resume, theme: theme.id };
        return (
          <div
            key={theme.id}
            className={`relative border-2 rounded-lg cursor-pointer transition-shadow duration-200 ${selectedTheme === theme.id ? 'ring-4 ring-blue-500' : 'hover:shadow-lg'}`}
            onClick={() => onSelect(theme.id)}
            style={{ background: '#f9f9f9' }}
          >
            <div className="p-2 flex flex-col items-center">
              <div style={{ 
                width: 180, 
                height: 255, 
                overflow: 'auto', 
                borderRadius: 8, 
                boxShadow: selectedTheme === theme.id ? '0 0 0 4px #3b82f6' : '0 1px 4px rgba(0,0,0,0.08)', 
                position: 'relative', 
                background: '#fff', 
                display: 'block', 
                padding: 0,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
                <style>
                  {`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}
                </style>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%) scale(0.22)', width: 820, height: 1160 }}>
                  <ResumeContainer resume={previewResume} />
                </div>
              </div>
              <div className="mt-2 text-center font-semibold text-sm">{theme.label}</div>
            </div>
            {selectedTheme === theme.id && (
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-lg flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-lg">Selected</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
