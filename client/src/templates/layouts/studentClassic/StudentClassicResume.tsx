import React from 'react';
import styled from 'styled-components';
import { ResumeTypeProps } from 'types/types';

const Main = styled.div`
  font-family: 'Georgia', serif;
  font-size: 0.95rem;
  padding: 0 36px 32px 36px;
  background: #fff;
  color: black;
`;

const Header = styled.div`
  background: #ece8dd;
  padding: 32px 0 16px 0;
  text-align: center;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  font-family: 'Georgia', serif;
`;

const Name = styled.h1`
  font-family: 'Georgia', serif;
  font-size: 2.4rem;
  letter-spacing: 0.08em;
  margin: 0;
  font-weight: normal;
  color: black;
`;

const Contact = styled.div`
  margin: 12px 0 0 0;
  font-size: 1rem;
  color: #555;
  font-family: 'Georgia', serif;
`;

const Section = styled.div`
  margin: 12px 0 0 0;
  padding: 0 8px 8px 8px;
`;

const SectionTitle = styled.h2`
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
  margin: 0 0 4px 0;
  border-bottom: 2px solid #bdb76b;
  padding-bottom: 2px;
`;

const SubTitle = styled.div`
  font-style: italic;
  color: #555;
`;

const KeyAchievements = styled.div`
  font-style: italic;
  margin-top: 8px;
`;

const BulletList = styled.ul`
  margin: 0 0 0 24px;
  padding: 0;
`;

const EduList = styled.div`
  margin-top: 8px;
  font-size: 0.95rem;
`;

const Email = styled.a`
  font-family: 'Georgia', serif;
  color: #555;
  text-decoration: underline dotted;
  font-size: 1rem;
`;

function formatPhone(phone?: string) {
  if (!phone) return '';
  // Remove non-digit characters
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const StudentClassicResume: React.FC<ResumeTypeProps> = ({ resume }) => {
  const basics = resume.basics || {};
  const education = resume.education || [];
  const work = resume.work || [];
  const volunteer = resume.volunteer || [];
  const profile = basics.summary || '';

  const sectionsMap: { [key: string]: JSX.Element } = {
    Profile: (
      <Section key="Profile">
        <SectionTitle>Profile</SectionTitle>
        <div style={{ textAlign: 'center' }}>{profile}</div>
      </Section>
    ),
    Volunteer: (
      <Section key="Volunteer">
        <SectionTitle>Volunteer Experience</SectionTitle>
        {volunteer.map((v, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <b>{v.position}</b>
            <SubTitle>{v.organization}</SubTitle>
            <div>{formatDate(v.startDate)} – {v.endDate ? formatDate(v.endDate) : 'Present'}</div>
            {v.highlights && v.highlights.length > 0 && (
              <KeyAchievements>
                Key Achievements:
                <BulletList>
                  {v.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </BulletList>
              </KeyAchievements>
            )}
          </div>
        ))}
      </Section>
    ),
    Work: (
      <Section key="Work">
        <SectionTitle>Work Experience</SectionTitle>
        {work.map((w, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <b>{w.position}</b>
            <SubTitle>{w.name}</SubTitle>
            <div>{formatDate(w.startDate)} – {w.endDate ? formatDate(w.endDate) : 'Present'}</div>
            {w.summary && <div>{w.summary}</div>}
            {w.highlights && w.highlights.length > 0 && (
              <KeyAchievements>
                Key Achievements:
                <BulletList>
                  {w.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </BulletList>
              </KeyAchievements>
            )}
          </div>
        ))}
      </Section>
    ),
    Education: (
      <Section key="Education">
        <SectionTitle>Education</SectionTitle>
        {education.map((e, idx) => (
          <div key={idx} style={{ marginBottom: 16 }}>
            <b>{e.institution}</b>
            <div>
              {e.studyType && <span>{e.studyType}</span>}
              {e.area && <span>{e.studyType ? ' in ' : ''}{e.area}</span>}
            </div>
            <div>
              {formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'Present'}
            </div>
            {e.score && <div>GPA: {e.score}</div>}
            {e.courses && e.courses.length > 0 && (
              <EduList>
                <b>Courses:</b> {e.courses.join(', ')}
              </EduList>
            )}
            {e.highlights && e.highlights.length > 0 && (
              <KeyAchievements>
                Key Achievements:
                <BulletList>
                  {e.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </BulletList>
              </KeyAchievements>
            )}
          </div>
        ))}
      </Section>
    ),
  };

  const sectionOrder = resume.sections || ["Profile", "Volunteer", "Work", "Education"];

  return (
    <>
      <Header>
        <Name>{basics.name}</Name>
        <Contact>
          {basics.location?.city}, {basics.location?.region}
          {basics.phone && (
            <>
              {' '}|{' '}
              <a href={`tel:${basics.phone}`} style={{ color: '#555', textDecoration: 'underline dotted' }}>{formatPhone(basics.phone)}</a>
            </>
          )}
          {basics.email && (
            <>
              {' '}|{' '}
              <Email href={`mailto:${basics.email}`}>{basics.email}</Email>
            </>
          )}
        </Contact>
      </Header>
      <Main>
        {sectionOrder.map((section) => sectionsMap[section] || null)}
      </Main>
    </>
  );
};

export default StudentClassicResume;
