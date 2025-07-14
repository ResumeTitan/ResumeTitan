import React from 'react';
import { ResumeType } from 'types/types';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border: 6px solid #222;
  border-radius: 12px;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  max-width: 850px;
  margin: 0 auto;
  font-family: 'Georgia', 'Times New Roman', Times, serif;
  color: #222;
`;

const Name = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
`;

const Contact = styled.div`
  text-align: center;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.div`
  font-size: 1.15rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #222;
  padding-bottom: 0.15rem;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.05rem;
`;

const JobSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const Bullets = styled.ul`
  margin: 0.25rem 0 0.5rem 1.25rem;
  padding: 0;
  list-style-type: disc;
`;

const Bullet = styled.li`
  margin-bottom: 0.25rem;
  font-size: 1rem;
`;

const Small = styled.span`
  font-size: 0.95rem;
`;

const MeyerResume: React.FC<{ resume: ResumeType }> = ({ resume }) => {
  const { basics, work = [], education = [], skills = [], awards = [], volunteer = [], sections = [] } = resume;

  return (
    <Container>
      <Name>{basics?.name || 'Your Name'}</Name>
      <Contact>
        {basics?.email} {basics?.phone && <>| {basics.phone}</>} {basics?.url && <>| {basics.url}</>}
        {basics?.profiles && basics.profiles[0]?.url && <> | {basics.profiles[0].url}</>}
      </Contact>

      {/* Professional Experience */}
      <Section>
        <SectionTitle>Professional Experience</SectionTitle>
        {work.map((job, i) => (
          <div key={i} style={{ marginBottom: '1.2rem' }}>
            <JobHeader>
              <span>{job.name}</span>
              {/* <span>{job.location || ''}</span> */}
            </JobHeader>
            <JobSubHeader>
              <span>{job.position}</span>
              <span>
                {job.startDate}{job.endDate ? ` – ${job.endDate}` : ''}
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
          <div key={i} style={{ marginBottom: '1.2rem' }}>
            <JobHeader>
              <span>{edu.institution}</span>
              {/* <span>{edu.location || ''}</span> */}
            </JobHeader>
            <JobSubHeader>
              <span>{edu.studyType} {edu.area && <>in {edu.area}</>} </span>
              <span>{edu.endDate ? `Graduated ${edu.endDate}` : ''}</span>
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

      {/* Skills, Volunteering, Interests */}
      <Section>
        <SectionTitle>Skills, Volunteering, & Interests</SectionTitle>
        <div>
          <b>Skills:</b> {skills.map(s => s.name).join(', ')}
        </div>
        {volunteer.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <b>Volunteering:</b> {volunteer.map(v => v.organization).join(', ')}
          </div>
        )}
        {resume.interests && resume.interests.length > 0 && (
          <div style={{ marginTop: 6 }}>
            <b>Interests:</b> {resume.interests.map(i => i.name).join(', ')}
          </div>
        )}
      </Section>
    </Container>
  );
};

export default MeyerResume; 