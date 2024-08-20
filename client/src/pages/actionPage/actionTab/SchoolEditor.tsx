import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs, { Dayjs } from 'dayjs';
import StatePicker from 'components/StatePicker';
import DegreePicker from 'components/DegreePicker';
import api from 'api/actions';
import { EducationType } from 'types/types';
import 'styles/index.css';

const newEducation = {
  id: -1,
  institution: '',
  area: '',
  studyType: '',
  startDate: '',
  endDate: '',
  endDateCurrent: false,
  score: '',
  courses: [],
  highlights: []
}

interface SchoolEditorProps {
  editingSchool: EducationType;
  onSave: (school: EducationType) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

function SchoolEditor({ editingSchool, onSave, onDelete, onCancel }: SchoolEditorProps) {
  const [schoolForm, setSchoolForm] = useState<EducationType>(editingSchool);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs(editingSchool.startDate || new Date()));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs(editingSchool.endDate || new Date()));
  const [endDateChecked, setEndDateChecked] = useState<boolean>(editingSchool.endDateCurrent || false);

  const handleSaveSchool = () => {
    const updatedSchool = {
      ...schoolForm,
      startDate: startDate.toString(),
      endDate: endDateChecked ? "" : endDate.toString(),
    };
    onSave(updatedSchool);
    setSchoolForm(newEducation);
  }

  const handleDeleteSchool = () => {
    onDelete(schoolForm.id || -1);
    setSchoolForm(newEducation);
  }

  const handleCancel = () => {
    onCancel();
    setSchoolForm(newEducation);
  }

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSchoolForm({ ...schoolForm, [id]: value });
  }

  // const handleStateChange = (state: string) => {
  //   setSchoolForm({ ...schoolForm, state: state });
  // }

  const handleDegreeChange = (degree: string) => {
    setSchoolForm({ ...schoolForm, studyType: degree });
  }

  const handleSchoolHighlightsChange = (highlights: string, index: number) => {
    const newForm = { ...schoolForm };
    if (newForm.highlights) {
      newForm.highlights[index] = highlights;
      setSchoolForm(newForm);
    }
  }

  const handleHighlightDelete = (index: number) => {
    const newForm = { ...schoolForm };
    if (newForm.highlights) {
      newForm.highlights.splice(index, 1);
      setSchoolForm(newForm);
    }
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setSchoolForm({ ...schoolForm, endDateCurrent: endDateCurrent, endDate: "" });
    setEndDateChecked(endDateCurrent);
  }

  const handleHighlightAdd = () => {
    setSchoolForm(prev => ({
      ...prev,
      highlights: prev.highlights ? [...prev.highlights, ""] : [""]
    }));
  }

  const handleAiCall = async () => {
    setAiLoading(true);
    try {
      const schoolResponse = await api.post("/resume/education", { education: schoolForm });
      setSchoolForm(prev => ({ ...prev, highlights: schoolResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""}`}>
      <div className="py-4">
        <label htmlFor={"institution"} className="form-label-text">School Name</label>
        <input 
          type="text"
          id={"institution"}
          className="form-style" 
          placeholder="Enter school name..."
          onChange={handleSchoolChange}
          value={schoolForm.institution || ''}
          required 
        />
      </div>
      <div className="mb-6">
        <label htmlFor={"area"} className="form-label-text">Area of Study</label>
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
        <label htmlFor={"studyType"} className="form-label-text">Degree</label>
        <DegreePicker onChange={handleDegreeChange}/>
      </div>

      {/* <div className="mb-6 left-right-spacing phone-screen-stack">
        <div className="w-full">
        <label htmlFor={"city"} className="form-label-text">City</label>
        <input 
          type="text"
          id={"city"}
          className="form-style"
          placeholder="Enter city..."
          value={schoolForm.city || ''}
          onChange={handleSchoolChange}
          required />
        </div>
        <div className="w-full">
        <label htmlFor={"state"} className="form-label-text">State</label>
        <StatePicker onChange={handleStateChange} initState={schoolForm.state || ""}/>
        </div>
      </div> */}

      <div className="mb-6 left-right-spacing phone-screen-stack">
        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Start Date"
                value={dayjs(startDate)}
                onChange={(newValue: Dayjs | null) => newValue && setStartDate(newValue)}
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
                onChange={(newValue: Dayjs | null) => newValue && setEndDate(newValue)}
                disabled={endDateChecked}
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
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" 
                onChange={handleEndDateCurrent}
                checked={endDateChecked}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="m-2">
        <div className="left-right-spacing flex my-2">
          <div className="flex items-center">
            <label htmlFor={"schoolHighlights"} className="form-label-text">Highlights</label>
          </div>

          <div className="flex flex-col space-y-2 xs:flex-row xs:space-y-0 xs:space-x-2">
            <button
              className="green-button order-last xs:order-first p-2 my-1"
              onClick={handleAiCall}
            >
              <div>
                <AutoAwesomeIcon className="pr-2"/>
                <span>Write with AI</span>
              </div>
            </button>
            <button
              className="green-button order-first xs:order-last p-2 my-1"
              onClick={handleHighlightAdd}
            >
              Add
            </button>
          </div>
        </div>
        {schoolForm.highlights ? schoolForm.highlights.map((item, index) => (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                id={"schoolHighlights"}
                className="form-style flex-wrap h-36 md:h-24 lg:h-16"
                placeholder="Enter highlights from school..."
                value={item}
                onChange={(e) => handleSchoolHighlightsChange(e.target.value, index)}
                required 
              />
            </div>
            <div className="flex items-center">
              <button
                className="remove-content-button"
                onClick={() => handleHighlightDelete(index)}
              >
                {"X"}
              </button>
            </div>
          </div>
          )
        ) : (
        <div className="left-right-spacing">
          <div className="w-full pr-2 py-1">
            <textarea 
              className="form-style flex-wrap h-24 lg:h-16"
              placeholder="Click add to start adding accomplishments/skills..."
              disabled
            />
          </div>
        </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          disabled={!schoolForm.id}
          className={`${schoolForm.id ? "remove-button" : "disabled-button"}`}
          onClick={handleDeleteSchool}
        >
          {"Delete"}
        </button>
        <button
          className="remove-button"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
        <button
          className="add-button-small"
          onClick={handleSaveSchool}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default SchoolEditor;
