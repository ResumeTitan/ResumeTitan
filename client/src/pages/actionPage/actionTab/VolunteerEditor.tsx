import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import dayjs from 'dayjs';
import StatePicker from 'components/StatePicker';
import { VolunteerType } from 'types/types';
import api from 'api/actions';
import 'styles/index.css';

interface VolunteerEditorProps {
  editingVolunteer: VolunteerType;
  onSave: (volunteer: VolunteerType) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}

const VolunteerEditor: React.FC<VolunteerEditorProps> = ({ editingVolunteer, onSave, onDelete, onCancel }) => {
  const [volunteerForm, setVolunteerForm] = useState(editingVolunteer);
  const [aiLoading, setAiLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(editingVolunteer.startDate) || new Date());
  const [endDate, setEndDate] = useState(new Date(editingVolunteer.endDate) || new Date());
  const [endDateChecked, setEndDateChecked] = useState(editingVolunteer.endDateCurrent || false);

  const handleSaveVolunteer = () => {
    volunteerForm.startDate = startDate.toString();
    if (endDateChecked) {
      volunteerForm.endDate = "";
    } else {
      volunteerForm.endDate = endDate.toString();
    }
    onSave(volunteerForm);
  }

  const handleDeleteVolunteer = () => {
    onDelete(volunteerForm.id || -1);
  }

  const handleCancel = () => {
    onCancel();
  }

  const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setVolunteerForm({ ...volunteerForm, [id]: value });
  }

  const handleVolunteerHighlightsChange = (highlights: string, index: number) => {
    const newForm = { ...volunteerForm };
    newForm.highlights[index] = highlights;
    setVolunteerForm(newForm);
  }

  // const handleStateChange = (state: string) => {
  //   setVolunteerForm({ ...volunteerForm, state: state });
  // }

  const handleHighlightsDelete = (index: number) => {
    const newForm = { ...volunteerForm };
    newForm.highlights.splice(index, 1);
    setVolunteerForm(newForm);
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setVolunteerForm({ ...volunteerForm, endDateCurrent: endDateCurrent });
    setEndDateChecked(!endDateChecked);
  }

  const handleHighlightAdd = () => {
    if (!volunteerForm.highlights) {
      setVolunteerForm({ ...volunteerForm, highlights: [""] });
    } else {
      setVolunteerForm({ ...volunteerForm, highlights: [...volunteerForm.highlights, ""] });
    }
  }

  const handleAiCall = async () => {
    setAiLoading(true);
    const volunteerResponse = await api.post("/resume/volunteer", { volunteer: volunteerForm });
    setVolunteerForm({ ...volunteerForm, highlights: volunteerResponse.data.response.highlights });
    setAiLoading(false);
  }

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""}`}>
      <div className="py-4">
        <label htmlFor={"position"} className="form-label-text">Position</label>
        <input 
          type="text"
          id={"position"}
          className="form-style" 
          placeholder="Enter volunteer position..."
          onChange={handleVolunteerChange}
          value={volunteerForm.position || ''}
          required />
      </div>
      <div className="my-6">
        <label htmlFor={"organization"} className="form-label-text">Organization</label>
        <input 
          type="text"
          id={"organization"}
          className="form-style"
          placeholder="Enter organization name..."
          value={volunteerForm.organization || ''}
          onChange={handleVolunteerChange}
          required 
        />
      </div> 
      {/* <div className="mb-6 left-right-spacing phone-screen-stack">
        <div className="w-full">
        <label htmlFor={"city"} className="form-label-text">City</label>
        <input 
          type="text"
          id={"city"}
          className="form-style"
          placeholder="Enter city..."
          value={volunteerForm.city || ''}
          onChange={handleVolunteerChange}
          required />
        </div>
        <div className="w-full">
        <label htmlFor={"state"} className="form-label-text">State</label>
        <StatePicker onChange={handleStateChange} initState={volunteerForm.state || ""}/>
        </div>
      </div> */}

      {/* <div className="mb-6 justify-between phone-screen-stack">
        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
              <DatePicker
                label="Start Date"
                value={dayjs(startDate)}
                onChange={(newValue) => {setStartDate(newValue?.toString() || "");}}
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
                onChange={(newValue) => {setEndDate(newValue?.toString() || "");}}
                disabled={endDateChecked}
              />
            </DemoContainer>
          </LocalizationProvider>
          <div className="left-right-spacing">
            <label htmlFor="endDateCheckbox" className="flex items-center">
              <div className="text-xs pr-2">Current</div>
            <input 
              id="endDateCheckbox"
              type="checkbox"
              value=""
              className="bg-gray-700 border-gray-600 w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" 
              onChange={handleEndDateCurrent}
              checked={endDateChecked}
            />
            </label>
          </div>
        </div>
      </div> */}

      <div className="m-2">
        <div className="left-right-spacing my-2">
          <div className="flex items-center">
            <label htmlFor={"volunteerHighlights"} className="form-label-text">Highlights</label>
          </div>
          
          <div className="phone-screen-stack">
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
        {volunteerForm.highlights ? volunteerForm.highlights.map((item, index) => (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                id={"volunteerHighlights"}
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Enter highlights from volunteer work..."
                value={item}
                onChange={(e) => handleVolunteerHighlightsChange(e.target.value, index)}
                required 
              />
            </div>
            <div className="flex items-center">
              <button
                className="remove-content-button"
                onClick={() => handleHighlightsDelete(index)}
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
                className="form-style flex-wrap h-24 lg:h-16 text-black"
                placeholder="Click add to start adding highlights..."
                disabled
              />
            </div>
          </div>
        )}
      </div>

      <div className="left-right-spacing">
        <button
          disabled={!volunteerForm.id}
          className={`${volunteerForm.id ? "remove-button" : "disabled-button"}`}
          onClick={handleDeleteVolunteer}
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
          onClick={handleSaveVolunteer}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
}

export default VolunteerEditor;
