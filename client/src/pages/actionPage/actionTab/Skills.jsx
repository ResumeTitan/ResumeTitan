import React, { useEffect, useState } from 'react';
import '../index.css';

function Skills ({ initSkills, onUpdate }) {
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleSkillsChange = (e, index) => {
    const { value } = e.target;
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  }

  const handleAddSkills = () => {
    setSkills([...skills, '']);
  }

  const handleSkillsDelete = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  }

  const handleSaveSkills = () => {
    setIsEditing(false);
    onUpdate(skills);
  }

  useEffect(() => {
    setSkills(initSkills);
  }, [initSkills]);

  return (
    <div className="form-container">
      <div className="form-text-main hover:bg-slate-500" onClick={() => {setIsEditing(true)}}>{"Skills"}</div>

      {isEditing && (
        <div className="p-4 ">
          <div className="w-full pr-2">
          {skills.map((item, index) => (
            <div className="flex justify-between">
            <input 
              type="text"
              id={"skills"}
              className="form-style"
              placeholder=""
              value={item || ''}
              onChange={(e) => handleSkillsChange(e, index)}
              required />
              <div className="pl-2">
                <button
                  className="remove-content-button"
                  onClick={() => handleSkillsDelete(index)}
                >
                  {"X"}
                </button>
            </div>
            </div>
            )
          )}
          </div>
          <div className="flex justify-between">
            <button
              className="green-button p-2 my-2 bg-slate-800"
              onClick={handleAddSkills}
            >
              {"Add"}
            </button>
            <button
              className="green-button p-2 my-2 bg-slate-800"
              onClick={handleSaveSkills}
            >
              {"Save"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Skills;
