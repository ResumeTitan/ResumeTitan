import React, { useState } from 'react';
import VolunteerEditor from './VolunteerEditor';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { VolunteerType } from 'types/types';
import 'styles/index.css';

interface VolunteersProps {
  volunteerExperience: VolunteerType[];
  onSave: (volunteer: VolunteerType) => void;
  onDelete: (id: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
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
              className="form-secondary-area" 
              onClick={() => handleEditVolunteer(volunteer.id!)}
            >
              <div>
                <div className="font-bold">
                  {volunteer.position}
                </div>
                <div>
                  {volunteer.organization}
                </div>
              </div>
              {/* <div>
                <button onClick={() => onReorder(index, index - 1)}>
                  <KeyboardArrowUpIcon />
                </button>
                <button onClick={() => onReorder(index, index + 1)}>
                  <KeyboardArrowDownIcon />
                </button>
                <button className="green-button p-2 border border-1" onClick={() => handleEditVolunteer(volunteer.id!)}>
                  {"Edit"}
                </button>
              </div> */}
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
