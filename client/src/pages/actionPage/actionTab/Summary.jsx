import React, { useState, useEffect } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AIAssistant from 'components/AIAssistant';
import 'styles/index.css';

const suggestions = [
  "Make the summary more concise and impactful",
  "Add more specific skills and achievements to the summary", 
  "Ensure the summary is tailored to the target job role",
  "Remove any vague or generic statements from the summary",
  "Highlight key quantifiable accomplishments in the summary",
  "Make the summary sound more professional and polished",
  "Add industry-specific keywords to improve ATS compatibility"
];

function Summary ({ summary, aiLoading, onUpdate, onAiCall }) {
  const [isEditing, setIsEditing] = useState(false);
  const [aiAssistant, showAiAssistant] = useState(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState('');
  const [placeholder, setPlaceholder] = useState(suggestions[0]);
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);

  useEffect(() => {
    if (aiAssistant) {
      let index = 0;
      const interval = setInterval(() => {
        setIsPlaceholderActive(false);
        setTimeout(() => {
          setPlaceholder(suggestions[index]);
          setIsPlaceholderActive(true);
          index = (index + 1) % suggestions.length;
        }, 300);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [aiAssistant]);

  const handleSummaryChange = (e) => {
    const { value } = e.target;
    onUpdate(value);
  }

  const handleSaveSummary = () => {
    setIsEditing(false);
    onUpdate(summary);
  }

  const handleAiAssistCall = async () => {
    if (aiAssistantMsg.trim()) {
      try {
        onAiCall(aiAssistantMsg);
        setAiAssistantMsg('');
        showAiAssistant(false);
      } catch (error) {
        console.error("Error calling AI:", error);
      }
    }
  }

  return (
    <div key="summary-editor" className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
      <div 
        className="form-single-header"
        onClick={() => {setIsEditing(!isEditing)}}
      >
        <div>{"Summary"}</div>
      </div>

      {isEditing ? (
        <div className="px-4 pb-4">
          <div className="w-full pr-2">
            <div className="py-2">
              <button
                className="primary-action-button"
                onClick={handleSaveSummary}
              >
                {"Save"}
              </button>
              {/* <button
                className="primary-action-button"
                onClick={() => onAiCall()}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>Write with AI</span>
                </div>
              </button> */}
              <button
                className="primary-action-button"
                onClick={() => showAiAssistant(true)}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>AI Assistant</span>
                </div>
              </button>
            </div>
            <div className="flex">
              <textarea 
                type="text"
                id={"summary"}
                className="form-style w-full h-64 sm:h-48"
                placeholder=""
                value={summary || ''}
                onChange={handleSummaryChange}
                required 
              />
            </div>

            {aiAssistant && (
              <AIAssistant
                placeholder={placeholder}
                isPlaceholderActive={isPlaceholderActive}
                aiAssistantMsg={aiAssistantMsg}
                onMessageChange={setAiAssistantMsg}
                onSubmit={handleAiAssistCall}
                onClose={() => showAiAssistant(false)}
                loading={aiLoading}
              />
            )}
          </div>
        </div>
      ) : (
        <div 
          className="form-single-content p-4 hover:bg-gray-300 hover:cursor-pointer"
          onClick={() => {setIsEditing(true)}}
        >
          {summary}
        </div>
      )}

    </div>
  );
}

export default Summary;
