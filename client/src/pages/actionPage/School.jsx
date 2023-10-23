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
          placeholder="Enter school name..."
          onChange={handleSchoolChange}
          value={schoolForm.name || ''}
          required />
      </div>
      <div className="mb-6">
        <label htmlFor={"major"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Major</label>
        <input 
          type="text"
          id={"major"}
          className="formStyle"
          placeholder="Enter major..."
          value={schoolForm.major || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>


      <div className="mb-6 flex flex-cols justify-between">
        <div className="w-full pr-2">
        <label htmlFor={"city"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
        <input 
          type="text"
          id={"city"}
          className="formStyle"
          placeholder="Enter city..."
          value={schoolForm.city || ''}
          onChange={handleSchoolChange}
          required />
        </div>
        <div className="w-full pl-2">
        <label htmlFor={"state"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
        <input 
          type="text"
          id={"state"}
          className="formStyle"
          placeholder="Enter state..."
          value={schoolForm.state || ''}
          onChange={handleSchoolChange}
          required />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor={"degree"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Degree Earned/Working Towards</label>
        <select id={"degree"} className="formStyle" defaultValue={""} onChange={handleSchoolChange}>
          <option value="" disabled>Select a degree...</option>
          <option>High School Diploma</option>
          <option>Bachelor of Science</option>
          <option>Bachelor of Arts</option>
          <option>Masters Degree</option>
          <option>Doctorate</option>
        </select>
      </div>
      <div className="w-full pr-2">
          <label htmlFor={"gradDate"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Graduation Date</label>
          <div className="flex flex-cols">
            <div className="w-[75%] pr-1">
              <input 
                type="text"
                id={"gradDateMonth"}
                className="formStyle"
                placeholder="Enter month..."
                value={schoolForm.startDateMonth || ''}
                onChange={handleSchoolChange}
                required />
            </div>
            <div className="pl-1">
              <input 
                type="text"
                id={"gradDateYear"}
                className="formStyle"
                placeholder="Enter year..."
                value={schoolForm.startDateYear || ''}
                onChange={handleSchoolChange}
                required />
            </div>
          </div>
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
          disabled={!schoolForm.id}
          className={`${schoolForm.id ? "removeButton bg-slate-800" : "disabledButton"}`}
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
        <button
          className="addButton bg-slate-800"
          onClick={handleSaveSchool}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default School;
