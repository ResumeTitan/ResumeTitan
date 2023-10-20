import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import School from './School';
import { addSchool, setSchool, deleteSchool } from 'state';
import SchoolIcon from '@mui/icons-material/School';
import './index.css';

function Schools({ adding, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSchool, setEditingSchool] = useState({});
  
  const dispatch = useDispatch();
  const schools = useSelector(state => state.schools);

  const handleSaveSchool = (schoolForm) => {
    setIsEditing(false);
    onSave();
    if (schoolForm.id) {
      dispatch(setSchool({ school: schoolForm }));
      return;
    } else {
      schoolForm.id = schools.length + 1;
      dispatch(addSchool({ school: schoolForm }));
    }
  }

  const handleDeleteSchool = (id) => {
    setIsEditing(false);
    dispatch(deleteSchool({ school: { id } }));
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleEditSchool = (index) => {
    setIsEditing(true);
    const foundSchool = schools.find(obj => obj.id === index);
    console.log('index', foundSchool);
    setEditingSchool(foundSchool);
  }

  const handleAddSchool = () => {
    setIsEditing(true);
    setEditingSchool({});
  }

  useEffect(() => {
    console.log('schools', schools);
  }, [schools]);

  useEffect(() => {
    if (adding) {
      setIsEditing(true);
      setEditingSchool({});
    } else {
      setIsEditing(false);
      setEditingSchool({});
    }
  }, [adding]);

  const editingForm = (
    <div className="p-4">
      <div className="whitespace-nowrap flex justify-between">
        <div className="formHeader">School Info</div>
      </div>
      <School editingSchool={editingSchool} onSave={handleSaveSchool} onDelete={handleDeleteSchool} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="border border-black border-2 rounded-lg w-full m-6 text-white bg-slate-700">
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          <div class="font-bold border-b border-black rounded-t p-4">{"School Info"}</div>
          {schools.map((school) => (
            <div className={`p-4 border-b border-black `} onClick={() => handleEditSchool(school.id)}>
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
