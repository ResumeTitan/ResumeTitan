import React, { useState } from 'react';
import VolunteerEditor from './VolunteerEditor';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import 'styles/index.css';
import { VolunteerType } from 'types/types';

interface VolunteersProps {
  volunteerExperience: VolunteerType[];
  onSave: (volunteer: VolunteerType) => void;
  onDelete: (id: number) => void;
  onReorder: (indexA: number, indexB: number) => void;
}

const Volunteers: React.FC<VolunteersProps> = ({ volunteerExperience, onSave, onDelete, onReorder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerType | {}>({});

  const handleSaveVolunteer = (volunteerForm: VolunteerType) => {
    setIsEditing(false);
    onSave(volunteerForm);
  }

  const handleDeleteVolunteer = (id: number) => {
    setIsEditing(false);
    onDelete(id);
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleEditVolunteer = (id: number) => {
    setIsEditing(true);
    const foundVolunteer = volunteerExperience.find(volunteer => volunteer.id === id);
    setEditingVolunteer(foundVolunteer || {});
  }

  const handleAddVolunteer = () => {
    setIsEditing(true);
    setEditingVolunteer({});
  }

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      onReorder(index, index - 1);
    }
  }

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < volunteerExperience.length - 1) {
      onReorder(index, index + 1);
    }
  }

  const editingForm = (
    <div className="px-4 pb-4">
      <VolunteerEditor editingVolunteer={editingVolunteer as VolunteerType} onSave={handleSaveVolunteer} onDelete={handleDeleteVolunteer} onCancel={handleCancel} />
    </div>
  );

  return (
    <div className="form-container">
      <div className="form-text-main">{"Volunteer"}</div>
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          {volunteerExperience.map((volunteer, index) => (
            <div key={`volunteer-${index}`} 
              className="form-secondary-area flex items-center" 
              onClick={() => handleEditVolunteer(volunteer.id!)}
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
                  disabled={index === volunteerExperience.length - 1}
                >
                  <KeyboardArrowDownIcon />
                </button>
              </div>
              <div className="flex-grow">
                <div className="font-bold">
                  {volunteer.position}
                </div>
                <div>
                  {volunteer.organization}
                </div>
              </div>
              <button 
                className="green-button px-6 py-2 border border-1 min-w-[100px]" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditVolunteer(volunteer.id!);
                }}
              >
                {"Edit"}
              </button>
            </div>
          ))}
          <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={handleAddVolunteer}>
            <VolunteerActivismIcon fontSize="large" />
            <span>{"Add Volunteer Experience"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Volunteers;
