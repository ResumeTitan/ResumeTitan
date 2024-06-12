import React, { useState } from 'react';
import SchoolEditor from './SchoolEditor';
import SchoolIcon from '@mui/icons-material/School';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import 'styles/index.css';

function Schools({ education, onSave, onDelete, onReorder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSchool, setEditingSchool] = useState({});

  const handleSaveSchool = (schoolForm) => {
    setIsEditing(false);
    onSave(schoolForm);
  }

  const handleDeleteSchool = (id) => {
    setIsEditing(false);
    onDelete(id);
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleEditSchool = (index) => {
    setIsEditing(true);
    const foundSchool = education.find(obj => obj.id === index);
    setEditingSchool(foundSchool);
  }

  const handleAddSchool = () => {
    setIsEditing(true);
    setEditingSchool({});
  }

  const editingForm = (
    <div className="px-4 pb-4">
      <SchoolEditor editingSchool={editingSchool} onSave={handleSaveSchool} onDelete={handleDeleteSchool} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="form-container">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div className="form-text-main">{"School Info"}</div>
          {education.map((school, index) => (
            <div key={`school-${index}`} 
              className="flex justify-between p-4 border-b border-black hover:bg-slate-500" 
              onClick={() => handleEditSchool(school.id)}
            >
              <div>
                <div className="font-bold">
                  {school.name}
                </div>
                <div className="">
                  {school.area}
                </div>
              </div>
              {/* <div>
                <button onClick={() => onReorder(index, index - 1)}>
                  <KeyboardArrowUpIcon />
                </button>
                <button onClick={() => onReorder(index, index + 1)}>
                  <KeyboardArrowDownIcon />
                </button>
                <button className="green-button p-2 border border-1" onClick={() => handleEditSchool(school.id)}>
                  {"Edit"}
                </button>
              </div> */}
            </div>
          ))}
          <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={handleAddSchool}>
            <SchoolIcon fontSize="large"/>
            <span>{"Add School"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schools;
