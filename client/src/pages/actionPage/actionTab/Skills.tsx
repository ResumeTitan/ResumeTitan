import React, { useEffect, useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import 'styles/index.css';

export interface SkillType {
  name: string;
  level: string;
  keywords: string[];
}

interface SkillsProps {
  initSkills: SkillType[];
  aiLoading: boolean;
  onUpdate: (skills: SkillType[]) => void;
  onAiCall: (input: string) => void;
}

const suggestions = [
  "What technical skills do you have?",
  "What programming languages are you proficient in?",
  "What tools and technologies have you worked with?",
  "What soft skills would you like to highlight?",
  "What industry-specific skills do you possess?",
  "What certifications or specialized training do you have?",
  "What skills would be most relevant for your target role?"
];

/**
 * @function Skills
 * @description Skills component for managing a list of skills.
 * @param {SkillsProps} props - The props for the Skills component.
 * @returns {React.ReactElement} The rendered Skills component.
 */
const Skills: React.FC<SkillsProps> = ({ initSkills, aiLoading, onUpdate, onAiCall }) => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [aiAssistant, showAiAssistant] = useState(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState('');
  const [placeholder, setPlaceholder] = useState(suggestions[0]);
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);
  const [newKeywords, setNewKeywords] = useState<string[]>([]);
  const [showAddMessage, setShowAddMessage] = useState(false);

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

  /**
   * @function handleSkillsChange
   * @description Handles changes to a skill input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the skill being changed.
   * @param {'name' | 'level'} field - The field being changed.
   */
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'name' | 'level') => {
    const { value } = e.target;
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  }

  /**
   * @function handleAddSkills
   * @description Adds a new empty skill to the list.
   */
  const handleAddSkills = () => {
    setSkills([...skills, { name: '', level: '', keywords: [] }]);
    setShowAddMessage(true);
    setTimeout(() => setShowAddMessage(false), 2000); // Hide message after 2 seconds
  }

  /**
   * @function handleSkillsDelete
   * @description Deletes a skill from the list.
   * @param {number} index - The index of the skill to delete.
   */
  const handleSkillsDelete = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  }

  const handleAddKeyword = (skillIndex: number) => {
    const keyword = newKeywords[skillIndex];
    if (keyword?.trim()) {
      const newSkills = [...skills];
      newSkills[skillIndex].keywords.push(keyword.trim());
      setSkills(newSkills);
      const updatedKeywords = [...newKeywords];
      updatedKeywords[skillIndex] = '';
      setNewKeywords(updatedKeywords);
    }
  }

  const handleDeleteKeyword = (skillIndex: number, keywordIndex: number) => {
    const newSkills = [...skills];
    newSkills[skillIndex].keywords.splice(keywordIndex, 1);
    setSkills(newSkills);
  }

  /**
   * @function handleSaveSkills
   * @description Saves the current skills and exits editing mode.
   */
  const handleSaveSkills = () => {
    setIsEditing(false);
    onUpdate(skills);
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

  // Initialize skills with initSkills prop
  useEffect(() => {
    setSkills(initSkills);
  }, [initSkills]);

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
      <div className="form-single-header" onClick={() => {setIsEditing(!isEditing)}}>{"Skills"}</div>

      {isEditing ? (
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <button
              className="green-button p-4 text-xl"
              onClick={handleSaveSkills}
            >
              {"Save"}
            </button>
            <div className="flex justify-center">
              <div className="relative">
                <button
                  className="green-button p-4"
                  onClick={handleAddSkills}
                >
                  {"Add Skill"}
                </button>
                {showAddMessage && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-dark-green px-3 py-1 rounded text-sm whitespace-nowrap animate-fade-in-out border border-dark-green">
                    Skill Added to bottom
                  </div>
                )}
              </div>
              <button
                className="green-button p-4"
                onClick={() => showAiAssistant(true)}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>AI Assistant</span>
                </div>
              </button>
            </div>
          </div>

          {aiAssistant && (
            <div className="mb-4">
              <div className="left-right-spacing flex items-center">
                <div className="w-full pr-2">
                  <textarea
                    className={`form-style flex-wrap h-max ${isPlaceholderActive ? 'placeholder-roll-down' : 'placeholder-roll-up'}`}
                    placeholder={placeholder}
                    value={aiAssistantMsg}
                    onChange={(e) => setAiAssistantMsg(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="green-button p-2"
                    onClick={handleAiAssistCall}
                  >
                    <div>
                      <AutoAwesomeIcon className="pr-2"/>
                      <span>Write with AI</span>
                    </div>
                  </button>
                  <button
                    className="green-button p-2"
                    onClick={() => showAiAssistant(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {skills.map((skill, skillIndex) => (
            <div key={skillIndex} className="mb-2 p-4 border rounded">
              <div className="flex flex-row">
                <input 
                  type="text"
                  className="form-style mb-1"
                  placeholder="Skill Name"
                  value={skill.name}
                  onChange={(e) => handleSkillsChange(e, skillIndex, 'name')}
                  required 
                />
              </div>
              <div className="flex mb-4">
                <input 
                  type="text"
                  className="form-style mr-2 p-2"
                  placeholder="New Keyword"
                  value={newKeywords[skillIndex] || ''}
                  onChange={(e) => {
                    const keywordsIn = [...newKeywords];
                    keywordsIn[skillIndex] = e.target.value;
                    setNewKeywords(keywordsIn);
                  }}
                />
                <button
                  className="green-button whitespace-nowrap"
                  onClick={() => handleAddKeyword(skillIndex)}
                >
                  Add Keyword
                </button>
              </div>
              <div className="flex flex-wrap mb-1">
                {skill.keywords.map((keyword, keywordIndex) => (
                  <div key={keywordIndex} className="py-2 pr-2">
                    <span 
                      className="bg-lighter-green text-dark-green px-2 py-1 rounded cursor-pointer"
                      onClick={() => handleDeleteKeyword(skillIndex, keywordIndex)}
                    >
                      {keyword} ✕
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="remove-content-button whitespace-nowrap my-2"
                onClick={() => handleSkillsDelete(skillIndex)}
              >
                Delete Skill
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          {skills && (
            <div className="form-secondary-area" onClick={() => {setIsEditing(true)}}>
              {skills.map(skill => skill.name).join(", ")}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Skills;
