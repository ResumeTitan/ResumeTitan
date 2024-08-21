import React from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import TranslateIcon from '@mui/icons-material/Translate';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import { VerticalList } from 'components/VerticalList';

interface SectionListProps {
  sections: string[];
  saveSections: (sections: string[]) => void;
}

const SectionList: React.FC<SectionListProps> = ({ sections, saveSections }) => {
  const sectionComponents = {
    Basics: <PersonIcon fontSize='large' />,
    Education: <SchoolIcon fontSize="large" />,
    Work: <WorkIcon fontSize="large" />,
    Projects: <AssessmentIcon fontSize="large" />,
    Certificates: <CardMembershipIcon fontSize="large" />,
    Publications: <LibraryBooksIcon fontSize="large" />,
    Volunteering: <VolunteerActivismIcon fontSize="large" />,
    Awards: <EmojiEventsIcon fontSize="large" />,
    Languages: <TranslateIcon fontSize="large" />,
    Skills: <BuildIcon fontSize="large" />,
  };

  return (
    <div className="flex items-center p-4">
      <VerticalList items={sections} icons={sectionComponents} onSave={saveSections}/>
    </div>
  );
};

export default SectionList;
