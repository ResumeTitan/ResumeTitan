import React, { useEffect, useState } from 'react';
import SchoolEditor from './SchoolEditor';
import SchoolIcon from '@mui/icons-material/School';
import 'styles/index.css';

function Schools({ education, onSave, onDelete }) {
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

  useEffect(() => {}, [education]);

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
            <div key={`school-${index}`} className="p-4 border-b border-black hover:bg-slate-500" onClick={() => handleEditSchool(school.id)}>
              <div className="flex justify-between font-bold">
                {school.name}
              </div>
              <div className="flex justify-between">
                {school.area}
              </div>
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
