import styled from 'styled-components';
import Projects from './Projects';
import Basics from './Basics';
import Education from './Education';
import Work from './Work';
import Volunteer from './Volunteer';
import Certificates from './Certificates';
import Publications from './Publications';
import Awards from './Awards';
import Skills from './Skills';
import Interests from './Interests';
import Languages from './Languages';
import References from './References';
import { ResumeTypeProps } from 'types/types';
import { getFontFamily } from '../../../utils/fontUtils';

const Layout = styled.div<{ $fontFamily: string }>`
  line-height: calc(1ex / 0.32);
  font-family: ${props => props.$fontFamily};
  color: black;
  height: 297mm;
`;

const sectionComponents = {
  Basics: Basics,
  Education: Education,
  Work: Work,
  Volunteer: Volunteer,
  Projects: Projects,
  Certificates: Certificates,
  Publications: Publications,
  Awards: Awards,
  Languages: Languages,
  Skills: Skills,
  Interests: Interests,
  References: References,
};

const Resume: React.FC<ResumeTypeProps> = ({ resume }) => {
  return (
    <Layout $fontFamily={getFontFamily(resume.font)}>
      {resume.sections.map((section) => {
        const SectionComponent = sectionComponents[section as keyof typeof sectionComponents];
        if (SectionComponent) {
          return <SectionComponent key={section} {...resume} />;
        }
        return null;
      })}
    </Layout>
  );
};

export default Resume;
