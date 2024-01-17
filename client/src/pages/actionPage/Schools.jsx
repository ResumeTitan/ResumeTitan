import React, { useEffect, useState } from 'react';
import School from './School';
import SchoolIcon from '@mui/icons-material/School';
import './Action.css';

function Schools({ schools, onSave, onDelete }) {
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
    const foundSchool = schools.find(obj => obj.id === index);
    setEditingSchool(foundSchool);
  }

  const handleAddSchool = () => {
    setIsEditing(true);
    setEditingSchool({});
  }

  useEffect(() => {}, [schools]);

  const editingForm = (
    <div className="px-4 pb-4">
      <School editingSchool={editingSchool} onSave={handleSaveSchool} onDelete={handleDeleteSchool} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="border border-black border-2 rounded-lg w-full my-4 text-white bg-slate-700">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div className="font-bold border-b border-black rounded-t p-4">{"School Info"}</div>
          {schools.map((school) => (
            <div className="p-4 border-b border-black hover:bg-slate-500" onClick={() => handleEditSchool(school.id)}>
              <div className="flex justify-between font-bold">
                {school.name}
              </div>
              <div className="flex justify-between">
                {school.degree}
              </div>
            </div>
          ))}
          <div className={`p-4 flex flex-col items-center justify-center addButton`} onClick={handleAddSchool}>
            <SchoolIcon fontSize="large"/>
            <span>{"Add School"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schools;
