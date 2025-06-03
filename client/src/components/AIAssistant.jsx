import React from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import 'styles/index.css';

const AIAssistant = ({
  placeholder,
  isPlaceholderActive,
  aiAssistantMsg,
  onMessageChange,
  onSubmit,
  onClose,
  loading = false
}) => {
  return (
    <div className="my-8">
      <div className="border-t border-gray-700 my-4"></div>
      <div className="flex flex-col h-32">
        <div className="flex-1 mb-2">
          <textarea
            className={`form-style w-full h-full resize-none ${isPlaceholderActive ? 'placeholder-roll-down' : 'placeholder-roll-up'}`}
            placeholder={placeholder}
            value={aiAssistantMsg}
            onChange={(e) => onMessageChange(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="primary-action-button flex-1 p-2"
            onClick={onSubmit}
            disabled={loading}
          >
            <div>
              <AutoAwesomeIcon className="pr-2"/>
              <span>Write with AI</span>
            </div>
          </button>
          <button
            className="secondary-action-button text-black border-black flex-1 p-2"
            onClick={onClose}
            disabled={loading}
          >
            Close AI Assistant
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 