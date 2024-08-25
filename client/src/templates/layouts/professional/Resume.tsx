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

const Layout = styled.div`
  margin: 0 auto;
  line-height: calc(1ex / 0.32);
  margin-bottom: 40px;
  margin-top: 20px;
  font-family: "Times New Roman", Times, serif;
  color: black;
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
    <Layout>
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
