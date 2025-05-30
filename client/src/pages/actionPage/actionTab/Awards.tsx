import React, { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {  Form, FormInput, FormButton, FormAlert, FormLabel, FormDateInput, FormHeader } from "components/Form/styled";
import "styles/index.css";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export interface AwardType {
  id?: string;
  title: string;
  date: string;
  awarder: string;
  summary: string;
}

interface AwardsProps {
  initAwards: AwardType[];
  aiLoading: boolean;
  onUpdate: (awards: AwardType[]) => void;
  onAiCall: () => void;
}

/**
 * @function Awards
 * @description Awards component for managing a list of awards.
 * @param {AwardsProps} props - The props for the Awards component.
 * @returns {React.ReactElement} The rendered Awards component.
 */
const Awards: React.FC<AwardsProps> = ({ initAwards, aiLoading, onUpdate, onAiCall }) => {
  const [awards, setAwards] = useState<AwardType[]>(initAwards);
  const [editingAward, setEditingAward] = useState<AwardType | null>(null);
  const [formData, setFormData] = useState<AwardType>({
    title: '',
    date: '',
    awarder: '',
    summary: ''
  });

  /**
   * @function handleAwardsChange
   * @description Handles changes to an award input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   * @param {number} index - The index of the award being changed.
   * @param {'title' | 'date' | 'awarder' | 'summary'} field - The field being changed.
   */
  const handleAwardsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: "title" | "date" | "awarder" | "summary"
  ) => {
    const { value } = e.target;
    const newAwards = [...awards];
    newAwards[index][field] = value;
    setAwards(newAwards);
  };

  /**
   * @function handleAddAward
   * @description Adds a new empty award to the list.
   */
  const handleAddAward = () => {
    setEditingAward({} as AwardType);
    setFormData({ title: '', date: '', awarder: '', summary: '' });
  };

  /**
   * @function handleAwardDelete
   * @description Deletes an award from the list.
   * @param {number} index - The index of the award to delete.
   */
  const handleAwardDelete = (index: number) => {
    const newAwards = [...awards];
    newAwards.splice(index, 1);
    setAwards(newAwards);
  };

  /**
   * @function handleSaveAwards
   * @description Saves the current awards and exits editing mode.
   */
  const handleSaveAwards = () => {
    setEditingAward(null);
    onUpdate(awards);
  };

  const handleEdit = (award: AwardType) => {
    setEditingAward(award);
    setFormData(award);
  };

  const handleSaveForm = () => {
    if (editingAward?.id) {
      const updatedAwards = awards.map(award => 
        award.id === editingAward.id ? { ...formData, id: award.id } : award
      );
      setAwards(updatedAwards);
      onUpdate(updatedAwards);
    } else {
      const newAward = { ...formData, id: String(awards.length + 1) };
      const updatedAwards = [...awards, newAward];
      setAwards(updatedAwards);
      onUpdate(updatedAwards);
    }
    setEditingAward(null);
    setFormData({ title: '', date: '', awarder: '', summary: '' });
  };

  const handleCancel = () => {
    setEditingAward(null);
    setFormData({ title: '', date: '', awarder: '', summary: '' });
  };

  const handleDelete = (id: string | undefined) => {
    if (!id) return;
    const updatedAwards = awards.filter(award => award.id !== id);
    setAwards(updatedAwards);
    onUpdate(updatedAwards);
    setEditingAward(null);
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      const updatedAwards = [...awards];
      [updatedAwards[index], updatedAwards[index - 1]] = [updatedAwards[index - 1], updatedAwards[index]];
      setAwards(updatedAwards);
      onUpdate(updatedAwards);
    }
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < awards.length - 1) {
      const updatedAwards = [...awards];
      [updatedAwards[index], updatedAwards[index + 1]] = [updatedAwards[index + 1], updatedAwards[index]];
      setAwards(updatedAwards);
      onUpdate(updatedAwards);
    }
  };

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
      <div className="form-text-main">{"Awards"}</div>

      {editingAward !== null ? (
        <div className="px-4 pb-4">
          <div className="m-2">
            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Award Title</label>
              </div>
            </div>
            <input
              type="text"
              className="form-style"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter award title"
            />

            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Date</label>
              </div>
            </div>
            <input
              type="text"
              className="form-style"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="Enter date"
            />

            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Awarder</label>
              </div>
            </div>
            <input
              type="text"
              className="form-style"
              value={formData.awarder}
              onChange={(e) => setFormData({ ...formData, awarder: e.target.value })}
              placeholder="Enter awarder"
            />

            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Summary</label>
              </div>
            </div>
            <textarea
              className="form-style h-24"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Enter award summary"
            />
          </div>

          <div className="left-right-spacing">
            <button
              disabled={!editingAward.id}
              className={`${editingAward.id ? "remove-button" : "disabled-button"}`}
              onClick={() => handleDelete(editingAward.id)}
            >
              Delete
            </button>
            <button
              className="remove-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="add-button-small"
              onClick={handleSaveForm}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          {awards.map((award, index) => (
            <div key={award.id} 
              className="form-secondary-area flex items-center" 
              onClick={() => handleEdit(award)}
            >
              <div className="flex items-center gap-2 mr-4">
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => handleMoveUp(index, e)}
                  disabled={index === 0}
                >
                  <KeyboardArrowUpIcon />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => handleMoveDown(index, e)}
                  disabled={index === awards.length - 1}
                >
                  <KeyboardArrowDownIcon />
                </button>
              </div>
              <div className="flex-grow">
                <div className="font-bold">{award.title}</div>
                <div>{award.date}</div>
                <div>{award.awarder}</div>
                {award.summary && <div className="mt-2">{award.summary}</div>}
              </div>
              <button 
                className="green-button px-6 py-2 border border-1 min-w-[100px]" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(award);
                }}
              >
                Edit
              </button>
            </div>
          ))}
          <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={handleAddAward}>
            <EmojiEventsIcon fontSize="large" />
            <span>{"Add Award"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Awards;
