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
  onAiCall: () => void;
}

/**
 * @function Skills
 * @description Skills component for managing a list of skills.
 * @param {SkillsProps} props - The props for the Skills component.
 * @returns {React.ReactElement} The rendered Skills component.
 */
const Skills: React.FC<SkillsProps> = ({ initSkills, aiLoading, onUpdate, onAiCall }) => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newKeyword, setNewKeyword] = useState<string>('');

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

  /**
   * @function handleAddKeyword
   * @description Adds a new keyword to a skill.
   * @param {number} skillIndex - The index of the skill to add the keyword to.
   */
  const handleAddKeyword = (skillIndex: number) => {
    if (newKeyword.trim()) {
      const newSkills = [...skills];
      newSkills[skillIndex].keywords.push(newKeyword.trim());
      setSkills(newSkills);
      setNewKeyword('');
    }
  }

  /**
   * @function handleDeleteKeyword
   * @description Deletes a keyword from a skill.
   * @param {number} skillIndex - The index of the skill.
   * @param {number} keywordIndex - The index of the keyword to delete.
   */
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

  // Initialize skills with initSkills prop
  useEffect(() => {
    setSkills(initSkills);
  }, [initSkills]);

  // Empty effect for aiLoading changes
  useEffect(() => {}, [aiLoading]);

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
      <div className="form-single-header" onClick={() => {setIsEditing(true)}}>{"Skills"}</div>

      {isEditing && (
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <button
              className="green-button p-1"
              onClick={handleSaveSkills}
            >
              {"Save"}
            </button>
            <div className="flex justify-center">
              <button
                className="green-button p-1 mr-1"
                onClick={handleAddSkills}
              >
                {"Add Skill"}
              </button>
              <button
                className="green-button p-1"
                onClick={onAiCall}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>Write with AI</span>
                </div>
              </button>
            </div>
          </div>
          <div className="w-full">
          {skills.map((skill, skillIndex) => (
            <div key={skillIndex} className="mb-4 p-4 border rounded">
              <input 
                type="text"
                className="form-style mb-2"
                placeholder="Skill Name"
                value={skill.name}
                onChange={(e) => handleSkillsChange(e, skillIndex, 'name')}
                required 
              />
              {/* <input 
                type="text"
                className="form-style mb-2"
                placeholder="Skill Level"
                value={skill.level}
                onChange={(e) => handleSkillsChange(e, skillIndex, 'level')}
                required 
              /> */}
              <div className="mb-2">
                <div className="flex flex-wrap mb-2">
                  {skill.keywords.map((keyword, keywordIndex) => (
                    <span 
                      key={keywordIndex} 
                      className="bg-lighter-green text-dark-green px-2 py-1 rounded mr-2 mb-2 cursor-pointer"
                      onClick={() => handleDeleteKeyword(skillIndex, keywordIndex)}
                    >
                      {keyword} ✕
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input 
                    type="text"
                    className="form-style flex-grow mr-2"
                    placeholder="New Keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                  />
                  <button
                    className="green-button p-1"
                    onClick={() => handleAddKeyword(skillIndex)}
                  >
                    Add Keyword
                  </button>
                </div>
              </div>
              <button
                className="remove-content-button"
                onClick={() => handleSkillsDelete(skillIndex)}
              >
                Delete Skill
              </button>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Skills;
