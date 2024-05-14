import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import StatePicker from 'components/StatePicker';
import DegreePicker from 'components/DegreePicker';
import 'styles/index.css';

function SchoolEditor({ editingSchool, onSave, onDelete, onCancel }) {
  const [schoolForm, setSchoolForm] = useState(editingSchool);
  const [startDate, setStartDate] = useState(new Date(editingSchool.startDate) || new Date());
  const [endDate, setEndDate] = useState(new Date(editingSchool.endDate) || new Date());
  const [endDateChecked, setEndDateChecked] = useState(editingSchool.endDateCurrent || false);

  const handleSaveSchool = () => {
    schoolForm.startDate = startDate.toString();
    if (endDateChecked) {
      schoolForm.endDate = "";
    } else {
      schoolForm.endDate = endDate.toString();
    }
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

  const handleStateChange = (state) => {
    setSchoolForm({ ...schoolForm, state: state });
  }

  /**
   * @function handleDegreeChange
   * @description Handle the change of the degree type
   * @param {string} degree Name of the study type/degree
   * @returns {void}
   */
  const handleDegreeChange = (degree) => {
    setSchoolForm({ ...schoolForm, studyType: degree });
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
    const endDateCurrent = !endDateChecked;
    setSchoolForm({ ...schoolForm, endDateCurrent: endDateCurrent, endDate: "" });
    setEndDateChecked(endDateCurrent);
  }

  return (
    <div className="mt-6">
      <div className="mb-6">
        <label htmlFor={"name"} className="form-label">School Name</label>
        <input 
          type="text"
          id={"name"}
          className="form-style" 
          placeholder="Enter school name..."
          onChange={handleSchoolChange}
          value={schoolForm.name || ''}
          required 
        />
      </div>
      <div className="mb-6">
        <label htmlFor={"area"} className="form-label">Area of Study</label>
        <input 
          type="text"
          id={"area"}
          className="form-style"
          placeholder="Enter area of study..."
          value={schoolForm.area || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>

      <div className="w-full mb-6 pr-2">
        <label htmlFor={"studyType"} className="form-label">Degree</label>
        <DegreePicker onChange={handleDegreeChange}/>
      </div>

      <div className="mb-2 left-right-spacing">
        <div className="w-full pr-2">
        <label htmlFor={"city"} className="form-label">City</label>
        <input 
          type="text"
          id={"city"}
          className="form-style"
          placeholder="Enter city..."
          value={schoolForm.city || ''}
          onChange={handleSchoolChange}
          required />
        </div>
        <div className="w-full pl-2">
        <label htmlFor={"state"} className="form-label">State</label>
        <StatePicker onChange={handleStateChange} initState={schoolForm.state || ""}/>
        </div>
      </div>

      <div className="mb-6 left-right-spacing pt-4">
        <div className="w-full pr-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Start Date"
                value={dayjs(startDate)}
                onChange={(newValue) => setStartDate(newValue.toString())}
                sx={{
                  svg: { color: "white" },
                  input: { color: "white" },
                  label: { color: "white" }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="End Date"
                value={dayjs(endDate)}
                onChange={(newValue) => {setEndDate(newValue.toString())}}
                disabled={endDateChecked}
                sx={{
                  svg: { color: "white" },
                  input: { color: "white" },
                  label: { color: "white" }
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          <div className="align-right">
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
        </div>
      </div>


      <div className="my-6">
        <label htmlFor={"notes"} className="form-label">Add details</label>
        <textarea 
          id={"notes"}
          className="form-style"
          placeholder="Add a few details about your time at school..."
          value={schoolForm.notes || ''}
          onChange={handleSchoolChange}
          required 
        />
      </div>

      {schoolForm.content && (
        <div className="m-2">
          <div className="left-right-spacing my-2">
            <label htmlFor={"jobContent"} className="block text-sm font-medium text-gray-900 dark:text-white">Content</label>
            <button
              className="green-button bg-slate-800 p-2"
              onClick={() => setSchoolForm({ ...schoolForm, content: [...schoolForm.content, ""] })}
            >
              {"Add"}
            </button>
          </div>
          {/* <VerticalList items={schoolForm.content.map((item, index) => ({ id: index + 1, content: item })) || []} onSave={handleSchoolContentChange} /> */}
          {schoolForm.content.map((item, index) => (
            <div className="left-right-spacing">
              <div className="w-full pr-2">
                <textarea 
                  type="text"
                  id={"jobContent"}
                  className="form-style flex-wrap"
                  placeholder="Enter content..."
                  value={item}
                  onChange={(e) => handleSchoolContentChange(e.target.value, index)}
                  required 
                />
              </div>
              <div>
                <button
                  className="remove-content-button"
                  onClick={() => handleContentDelete(index)}
                >
                  {"X"}
                </button>
              </div>
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
          className="addButton p-1 bg-slate-800"
          onClick={handleSaveSchool}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default SchoolEditor;
