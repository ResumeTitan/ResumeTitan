import React from 'react';
import { ResumeType } from 'types/types';
import styled from 'styled-components';
import { formatDate } from '../../../utils';

const Container = styled.div`
  background: white;
  padding: 10mm 12mm 8mm 12mm;
  width: 100%;
  height: 100%;
  font-family: 'Georgia', 'Times New Roman', Times, serif;
  color: #222;
  box-sizing: border-box;
  overflow: hidden;
  font-size: 10pt;
  line-height: 1.2;
`;

const Name = styled.div`
  font-size: 20pt;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1mm;
  line-height: 1.1;
`;

const Contact = styled.div`
  text-align: center;
  font-size: 10pt;
  margin-bottom: 4mm;
  line-height: 1.2;
`;

const Section = styled.div`
  margin-top: 4mm;
`;

const SectionTitle = styled.div`
  font-size: 12pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2mm;
  border-bottom: 1pt solid #222;
  padding-bottom: 1mm;
  line-height: 1.2;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 11pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const JobSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 10pt;
  margin-bottom: 1mm;
  line-height: 1.2;
`;

const Bullets = styled.ul`
  margin: 1mm 0 1mm 3mm;
  padding: 0;
  list-style-type: disc;
`;

const Bullet = styled.li`
  margin-bottom: 1mm;
  font-size: 9pt;
  line-height: 1.3;
`;

const Small = styled.span`
  font-size: 9pt;
  line-height: 1.2;
`;

const SkillsSection = styled.div`
  font-size: 9pt;
  line-height: 1.3;
  margin-bottom: 1mm;
`;

const MeyerResume: React.FC<{ resume: ResumeType }> = ({ resume }) => {
  const { basics, work = [], education = [], skills = [], awards = [], volunteer = [], sections = [] } = resume;

  return (
    <Container>
      <Name>{basics?.name || 'Your Name'}</Name>
      <Contact>
        {basics?.email} {basics?.phone && <>| {basics.phone}</>} {basics?.url && <>| {basics.url}</>}
        {basics?.profiles && basics.profiles[0]?.url && <> | {basics.profiles[0].url}</>}
        {basics?.location && basics?.location.city && basics?.location.region && <> | {basics.location.city}, {basics.location.region}</>}
      </Contact>

      {/* Professional Experience */}
      <Section>
        <SectionTitle>Professional Experience</SectionTitle>
        {work.map((job, i) => (
          <div key={i}>
            <JobHeader>
              <span>{job.name}</span>
            </JobHeader>
            <JobSubHeader>
              <span>{job.position}</span>
              <span>
                {job.startDate ? ` ${formatDate(job.startDate)}` : ''} {job.endDate ? ` - ${formatDate(job.endDate)}` : ''}
              </span>
            </JobSubHeader>
            {job.highlights && job.highlights.length > 0 && (
              <Bullets>
                {job.highlights.map((hl, j) => (
                  <Bullet key={j}>{hl}</Bullet>
                ))}
              </Bullets>
            )}
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section>
        <SectionTitle>Education</SectionTitle>
        {education.map((edu, i) => (
          <div key={i}>
            <JobHeader>
              <span>{edu.institution}</span>
            </JobHeader>
            <JobSubHeader>
              <span>{edu.studyType} {edu.area && <>in {edu.area}</>} </span>
              <span>{edu.endDate ? `Graduated ${formatDate(edu.endDate)}` : ''}</span>
            </JobSubHeader>
            {edu.score && <Small>GPA: {edu.score}</Small>}
            {edu.highlights && edu.highlights.length > 0 && (
              <Bullets>
                {edu.highlights.map((hl, j) => (
                  <Bullet key={j}>{hl}</Bullet>
                ))}
              </Bullets>
            )}
          </div>
        ))}
      </Section>

      {/* Skills*/}
      <Section>
        <SectionTitle>Skills</SectionTitle>
        {skills.map((skill, index) => (
          <SkillsSection key={index}>
            <b>{skill.name}{skill.keywords.length > 0 ? ':' : ''}</b> {skill.keywords && skill.keywords.length > 0 ? skill.keywords.join(', ') : ''}
          </SkillsSection>
        ))}
      </Section>
    </Container>
  );
};

export default MeyerResume; 