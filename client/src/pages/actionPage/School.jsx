import React, { useState } from 'react';

function School({ editingSchool, onSave, onDelete, onCancel }) {
  const [schoolForm, setSchoolForm] = useState(editingSchool);
  const [endDateChecked, setEndDateChecked] = useState(false);

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

  const handleSchoolContentChange = (content, index) => {
    const newForm = { ...schoolForm };
    newForm.content[index] = content;
    setSchoolForm(newForm);
  }

  const handleContentDelete = (index) => {
    const newForm = { ...schoolForm };
    newForm.content.splice(index, 1);
    setSchoolForm(newForm);
  }

  const handleEndDateCurrent = () => {
    setEndDateChecked(!endDateChecked);
    if (endDateChecked) {
      setSchoolForm({ ...schoolForm, endDateMonth: '', endDateYear: '' });
    }
  }

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

      <div className="mb-6 flex flex-cols justify-between">
        <div className="w-full pr-2">
          <label htmlFor={"startDate"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
          <div className="flex flex-cols">
            <div className="w-[75%] pr-1">
              <input 
                type="text"
                id={"startDateMonth"}
                className="formStyle"
                placeholder="Enter month..."
                value={schoolForm.startDateMonth || ''}
                onChange={handleSchoolChange}
                required />
            </div>
            <div className="pl-1">
              <input 
                type="text"
                id={"startDateYear"}
                className="formStyle"
                placeholder="Enter year..."
                value={schoolForm.startDateYear || ''}
                onChange={handleSchoolChange}
                required />
            </div>
          </div>
        </div>
        <div className="w-full pl-2">
        <div className="w-full pr-2">
          <div className="flex flex-cols justify-between">
            <label htmlFor={"endDate"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
            <label htmlFor="endDateCheckbox" className="flex items-center">
              <div className="text-xs pr-2">Current</div>
            <input 
              id="endDateCheckbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
              onChange={handleEndDateCurrent}
              checked={endDateChecked}
            />
            </label>
          </div>
          <div className="flex flex-cols">
            <div className="w-[75%] pr-1">
              <input 
                type="text"
                id={"endDateMonth"}
                className={`formStyle ${endDateChecked ? '' : 'disabled'}`}
                placeholder="Enter month..."
                value={schoolForm.endDateMonth || ''}
                onChange={handleSchoolChange}
                disabled={endDateChecked}
              />
            </div>
            <div className="pl-1">
              <input 
                type="text"
                id={"endDateYear"}
                className={`formStyle ${endDateChecked ? '' : 'disabled'}`}
                placeholder="Enter year..."
                value={schoolForm.endDateYear || ''}
                onChange={handleSchoolChange}
                disabled={endDateChecked}
              />
            </div>
          </div>
      </div>
        </div>
      </div>


      <div className="my-6">
        <label htmlFor={"notes"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Notes</label>
        <textarea 
          id={"notes"}
          className="formStyle"
          placeholder="Enter a description about your time at school..."
          value={schoolForm.notes || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>

      {schoolForm.content && (
        <div className="m-2">
          <div className="flex flex-cols justify-between my-2">
            <label htmlFor={"jobContent"} className="block text-sm font-medium text-gray-900 dark:text-white">Content</label>
            <button
              className="greenButton bg-slate-800"
              onClick={() => setSchoolForm({ ...schoolForm, content: [...schoolForm.content, ""] })}
            >
              {"Add"}
            </button>
          </div>
          {/* <VerticalList items={schoolForm.content.map((item, index) => ({ id: index + 1, content: item })) || []} onSave={handleSchoolContentChange} /> */}
          {schoolForm.content.map((item, index) => (
            <div className="flex flex-cols justify-between">
              <div className="w-full pr-2">
                <input 
                  type="text"
                  id={"jobContent"}
                  className="formStyle flex-wrap"
                  placeholder="Enter content..."
                  value={item}
                  onChange={(e) => handleSchoolContentChange(e.target.value, index)}
                  required 
                />
              </div>
              <button
                className="redButton bg-slate-800"
                onClick={() => handleContentDelete(index)}
              >
                {"X"}
              </button>
            </div>
            )
          )}
        </div>
      )}

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
