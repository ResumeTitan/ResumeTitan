import React, { useState } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import TranslateIcon from '@mui/icons-material/Translate';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BuildIcon from '@mui/icons-material/Build';
import CloseIcon from '@mui/icons-material/Close';
import 'styles/index.css';

interface ButtonData {
  label: string;
  icon: React.ReactElement;
}

interface ButtonGridProps {
  onAdd: (sections: string[]) => void;
  onClose: () => void;
}

const ButtonGridComponent: React.FC<ButtonGridProps> = ({ onAdd, onClose }) => {
  const [selectedButtons, setSelectedButtons] = useState<number[]>([]);

  const handleButtonClick = (index: number) => {
    if (selectedButtons.includes(index)) {
      setSelectedButtons(selectedButtons.filter((i) => i !== index));
    } else {
      setSelectedButtons([...selectedButtons, index]);
    }
  };

  const getSectionsAsStrings = () => {
    return selectedButtons.map(index => buttons[index].label);
  }

  const buttons: ButtonData[] = [
    { label: 'Education', icon: <SchoolIcon fontSize="large" /> },
    { label: 'Work', icon: <WorkIcon fontSize="large" /> },
    { label: 'Certificates', icon: <CardMembershipIcon fontSize="large" /> },
    { label: 'Languages', icon: <TranslateIcon fontSize="large" /> },
    { label: 'Volunteering', icon: <VolunteerActivismIcon fontSize="large" /> },
    { label: 'Awards', icon: <EmojiEventsIcon fontSize="large" /> },
    { label: 'Publications', icon: <LibraryBooksIcon fontSize="large" /> },
    { label: 'Projects', icon: <AssessmentIcon fontSize="large" /> },
    { label: 'Skills', icon: <BuildIcon fontSize="large" /> },
  ];

  return (
    <div className="layover-container flex-col flex justify-center items-center">
      <div className={`${selectedButtons.length > 0 ? 'animate-slideUp' : ''} flex justify-end`}>
        <button
          onClick={onClose}
          className="m-2 p-2 bg-gray-300 rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
      <div className={`${selectedButtons.length > 0 ? 'animate-slideUp' : ''} bg-gray-200 p-6 rounded grid grid-cols-3 gap-4`}>
        {buttons.map((button, index) => (
          <div
            key={index}
            onClick={() => handleButtonClick(index)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
              selectedButtons.includes(index)
                ? 'bg-light-green shadow-lg'
                : 'bg-gray-100 shadow-md'
            } hover:bg-main-green hover:text-white`}
          >
            {button.icon}
            <span className="mt-2 text-sm font-bold">{button.label}</span>
          </div>
        ))}
      </div>

      {selectedButtons.length >= 1 && (
        <div className="m-2 animate-slideUpFadeIn flex justify-center">
          <div
            className="flex items-center justify-center p-4 bg-teal-500 hover:bg-teal-600 text-white shadow-md rounded-full cursor-pointer transition-opacity duration-500"
            onClick={() => onAdd(getSectionsAsStrings())}
          >
            <AddCircleIcon fontSize="large" />
            <span className="ml-2">Add Sections</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ButtonGridComponent;
