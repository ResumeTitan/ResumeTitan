import React, { useEffect, useState } from 'react';

function School({ editingSchool, onSave, onDelete, onCancel }) {
  const [schoolForm, setSchoolForm] = useState(editingSchool);

  const handleSaveSchool = () => {
    onSave(schoolForm);
    setSchoolForm({});
  }

  const handleDeleteSchool = () => {
    onDelete(schoolForm.id || -1);
    setSchoolForm({});
  }

  const handleCancel = () => {
    onCancel();
    setSchoolForm({});
  }

  const handleSchoolChange = (e) => {
    const { id, value } = e.target;
    setSchoolForm({ ...schoolForm, [id]: value });
  }

  useEffect(() => {
    console.log('schoolForm', schoolForm);
  }, [schoolForm]);

  return (
    <div className="mt-6">
      <div className="mb-6">
        <label htmlFor={"name"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">School Name</label>
        <input 
          type="text"
          id={"name"}
          className="formStyle" 
          placeholder="Harvard University"
          onChange={handleSchoolChange}
          value={schoolForm.name || ''}
          required />
      </div>
      <div className="mb-6">
        <label htmlFor={"location"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
        <input 
          type="text"
          id={"location"}
          className="formStyle"
          placeholder="Raleigh, NC"
          value={schoolForm.location || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div> 
      <div className="mb-6">
        <label htmlFor={"schoolmajor"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
        <input 
          type="text"
          id={"major"}
          className="formStyle"
          placeholder="Business Administration"
          value={schoolForm.major || ''}
          onChange={handleSchoolChange}
          required />
      </div> 
      <div className="mb-6">
        <label htmlFor={"degree"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
        <select id={"degree"} className="formStyle" onChange={handleSchoolChange}>
          <option >High School Diploma</option>
          <option>Bachelor of Science</option>
          <option>Bachelor of Arts</option>
          <option>Masters Degree</option>
          <option>Doctorate</option>
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400">Graduation Date</label>
        <input
          type="date" 
          id={"graduationDate"}
          className="formStyle"
          value={schoolForm.graduationDate || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>
      <div className="my-6">
        <label htmlFor={"notes"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
        <textarea 
          id={"notes"}
          className="formStyle"
          placeholder="Math club, passed organic chemistry, etc."
          value={schoolForm.notes || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>
      <div className="flex justify-between">
        <button
          className="addButton bg-slate-800"
          onClick={handleSaveSchool}
        >
          {"Save"}
        </button>
        <button
          className="removeButton bg-slate-800"
          onClick={handleDeleteSchool}
        >
          {"Delete"}
        </button>
        <button
          className="removeButton bg-slate-800"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
      </div>
    </div>
  );
}

export default School;
