import React from 'react';
import VolunteerIcon from '@mui/icons-material/VolunteerActivism';

interface Volunteer {
  id: string;
  name: string;
  area: string;
}

interface VolunteersProps {
  volunteering: Volunteer[];
  handleEditVolunteer: (id: string) => void;
  handleAddVolunteer: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const Volunteers: React.FC<VolunteersProps> = ({
  volunteering,
  handleEditVolunteer,
  handleAddVolunteer,
  onReorder,
}) => {
  return (
    <div className="form-container">
      <div className="form-text-main">{"Volunteering"}</div>
      {volunteering.map((volunteer, index) => (
        <div
          key={`volunteer-${index}`}
          className="form-secondary-area"
          onClick={() => handleEditVolunteer(volunteer.id)}
        >
          <div>
            <div className="font-bold">{volunteer.name}</div>
            <div>{volunteer.area}</div>
          </div>
          {/* Uncomment if needed
          <div>
            <button onClick={() => onReorder(index, index - 1)}>
              <KeyboardArrowUpIcon />
            </button>
            <button onClick={() => onReorder(index, index + 1)}>
              <KeyboardArrowDownIcon />
            </button>
            <button className="green-button p-2 border border-1" onClick={() => handleEditVolunteer(volunteer.id)}>
              {"Edit"}
            </button>
          </div>
          */}
        </div>
      ))}
      <div
        className="p-4 flex flex-col items-center justify-center add-button"
        onClick={handleAddVolunteer}
      >
        <VolunteerIcon fontSize="large" />
        <span>{"Add Volunteer"}</span>
      </div>
    </div>
  );
};

export default Volunteers;