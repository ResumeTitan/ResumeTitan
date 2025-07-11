import React from 'react';
import styled from 'styled-components';
import { ResumeTypeProps } from 'types/types';
import { getFontFamily } from '../../../utils/fontUtils';

const Main = styled.div<{ $fontFamily: string }>`
  font-family: ${props => props.$fontFamily};
  font-size: 0.9rem;
  padding: 0 32px 24px 32px;
  background: #fff;
  color: #1a1a1a;
  line-height: 1.4;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 28px 0 16px 0;
  text-align: center;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  color: white;
`;

const Name = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Contact = styled.div`
  margin: 12px 0 0 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
`;

const Section = styled.div`
  margin: 10px 0 0 0;
  padding: 0 8px 8px 8px;
`;

const SectionTitle = styled.h2`
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  margin: 0 0 6px 0;
  color: #667eea;
  border-bottom: 3px solid #667eea;
  padding-bottom: 3px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 50px;
    height: 3px;
    background: #764ba2;
  }
`;

const SubTitle = styled.div`
  font-style: italic;
  color: #666;
  font-weight: 500;
`;

const KeyAchievements = styled.div`
  margin-top: 8px;
  font-weight: 500;
`;

const BulletList = styled.ul`
  margin: 6px 0 0 20px;
  padding: 0;
  
  li {
    margin-bottom: 3px;
    color: #444;
    font-size: 0.85rem;
  }
`;

const EduList = styled.div`
  margin-top: 6px;
  font-size: 0.9rem;
`;

const Email = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    border-bottom: 1px solid rgba(255, 255, 255, 0.8);
  }
`;

function formatPhone(phone?: string) {
  if (!phone) return '';
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

const AcademicModernResume: React.FC<ResumeTypeProps> = ({ resume }) => {
  const basics = resume.basics || {};
  const education = resume.education || [];
  const work = resume.work || [];
  const volunteer = resume.volunteer || [];
  const skills = resume.skills || [];
  const awards = resume.awards || [];
  const projects = resume.projects || [];
  const certificates = resume.certificates || [];
  const publications = resume.publications || [];
  const languages = resume.languages || [];
  const interests = resume.interests || [];
  const references = resume.references || [];
  const profile = basics.summary || '';

  const sectionsMap: { [key: string]: JSX.Element } = {
    Profile: (
      <Section key="Profile">
        <SectionTitle>Profile</SectionTitle>
        <div style={{ 
          textAlign: 'left', 
          padding: '12px 16px',
          backgroundColor: '#f8faff',
          borderRadius: '6px',
          border: '1px solid #e1e8ff',
          fontSize: '0.9rem'
        }}>
          {profile}
        </div>
      </Section>
    ),
    Skills: (
      <Section key="Skills">
        <SectionTitle>Skills</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {skills.map((skill, idx) => (
            <div key={idx} style={{ 
              backgroundColor: '#667eea',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              <div>{skill.name}</div>
              {skill.keywords && skill.keywords.length > 0 && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.9, 
                  marginTop: '2px',
                  fontWeight: '400'
                }}>
                  {skill.keywords.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),
    Projects: (
      <Section key="Projects">
        <SectionTitle>Projects</SectionTitle>
        {projects.map((project, idx) => (
          <div key={idx} style={{ 
            marginBottom: 14, 
            padding: '12px',
            border: '1px solid #e1e8ff',
            borderRadius: '6px',
            backgroundColor: '#fafbff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
              <b style={{ fontSize: '1rem', color: '#1a1a1a' }}>{project.name}</b>
              {project.url && (
                <a 
                  href={project.url} 
                  style={{ 
                    marginLeft: 10, 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  → View Project
                </a>
              )}
            </div>
            {project.startDate && (
            <SubTitle style={{ marginBottom: '6px', fontSize: '0.85rem' }}>
              {formatDate(project.startDate)} – {project.endDate ? formatDate(project.endDate) : 'Present'}
            </SubTitle>
            )}
            {project.description && (
              <div style={{ marginBottom: '6px', color: '#444', fontSize: '0.85rem' }}>{project.description}</div>
            )}
            {project.highlights && project.highlights.length > 0 && (
              <KeyAchievements>
                Key Features:
                <BulletList>
                  {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </BulletList>
              </KeyAchievements>
            )}
          </div>
        ))}
      </Section>
    ),
    Awards: (
      <Section key="Awards">
        <SectionTitle>Awards & Honors</SectionTitle>
        {awards.map((award, idx) => (
          <div key={idx} style={{ 
            marginBottom: 12,
            padding: '10px 12px',
            borderLeft: '3px solid #764ba2',
            backgroundColor: '#fafbff'
          }}>
            <b style={{ color: '#1a1a1a', fontSize: '0.95rem' }}>{award.title}</b>
            {award.awarder && <SubTitle style={{ fontSize: '0.85rem' }}>{award.awarder}</SubTitle>}
            {award.date && <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>
              {formatDate(award.date)}
            </div>}
            {award.summary && (
              <div style={{ marginTop: 6, color: '#444', fontSize: '0.85rem' }}>{award.summary}</div>
            )}
          </div>
        ))}
      </Section>
    ),
    Certificates: (
      <Section key="Certificates">
        <SectionTitle>Certifications</SectionTitle>
        {certificates.map((cert, idx) => (
          <div key={idx} style={{ 
            marginBottom: 12,
            padding: '10px 12px',
            border: '1px solid #e1e8ff',
            borderRadius: '5px',
            backgroundColor: '#f8faff'
          }}>
            <b style={{ color: '#1a1a1a', fontSize: '0.95rem' }}>{cert.name}</b>
            {cert.issuer && <SubTitle style={{ fontSize: '0.85rem' }}>{cert.issuer}</SubTitle>}
            {cert.date && <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>
              {formatDate(cert.date)}
            </div>}
            {cert.url && (
              <div style={{ marginTop: 6 }}>
                <a 
                  href={cert.url} 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}
                >
                  → View Certificate
                </a>
              </div>
            )}
          </div>
        ))}
      </Section>
    ),
    Publications: (
      <Section key="Publications">
        <SectionTitle>Publications</SectionTitle>
        {publications.map((pub, idx) => (
          <div key={idx} style={{ 
            marginBottom: 12,
            padding: '10px 12px',
            borderLeft: '3px solid #667eea',
            backgroundColor: '#fafbff'
          }}>
            <b style={{ color: '#1a1a1a', fontSize: '0.95rem' }}>{pub.name}</b>
            {pub.url && (
              <a 
                href={pub.url} 
                style={{ 
                  marginLeft: 6, 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontSize: '0.8rem'
                }}
              >
                → View Publication
              </a>
            )}
            {pub.publisher && <SubTitle style={{ fontSize: '0.85rem' }}>{pub.publisher}</SubTitle>}
            {pub.releaseDate && <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>
              {formatDate(pub.releaseDate)}
            </div>}
            {pub.summary && (
              <div style={{ marginTop: 6, color: '#444', fontSize: '0.85rem' }}>{pub.summary}</div>
            )}
          </div>
        ))}
      </Section>
    ),
    Languages: (
      <Section key="Languages">
        <SectionTitle>Languages</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          {languages.map((lang, idx) => (
            <div key={idx} style={{ 
              padding: '8px 12px',
              backgroundColor: '#f8faff',
              borderRadius: '5px',
              border: '1px solid #e1e8ff'
            }}>
              <b style={{ color: '#1a1a1a', fontSize: '0.9rem' }}>{lang.language}</b>
              {lang.fluency && (
                <div style={{ color: '#667eea', fontSize: '0.8rem', marginTop: '2px', fontWeight: '500' }}>
                  {lang.fluency}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    ),
    Interests: (
      <Section key="Interests">
        <SectionTitle>Interests</SectionTitle>
        {interests.map((interest, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <b style={{ color: '#1a1a1a', fontSize: '0.9rem' }}>{interest.name}</b>
            {interest.keywords && interest.keywords.length > 0 && (
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#666', 
                marginTop: 3,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px'
              }}>
                {interest.keywords.map((keyword, i) => (
                  <span key={i} style={{
                    backgroundColor: '#e1e8ff',
                    color: '#667eea',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.75rem'
                  }}>
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </Section>
    ),
    References: (
      <Section key="References">
        <SectionTitle>References</SectionTitle>
        {references.map((ref, idx) => (
          <div key={idx} style={{ 
            marginBottom: 12,
            padding: '12px',
            backgroundColor: '#f8faff',
            borderRadius: '6px',
            border: '1px solid #e1e8ff'
          }}>
            <b style={{ color: '#1a1a1a', fontSize: '0.95rem' }}>{ref.name}</b>
            {ref.reference && (
              <div style={{ 
                marginTop: 6, 
                color: '#444',
                fontStyle: 'italic',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}>
                "{ref.reference}"
              </div>
            )}
          </div>
        ))}
      </Section>
    ),
    Volunteer: (
      <Section key="Volunteer">
        <SectionTitle>Volunteer Experience</SectionTitle>
        {volunteer.map((v, idx) => (
          <div key={idx} style={{ 
            marginBottom: 16,
            padding: '12px',
            border: '1px solid #e1e8ff',
            borderRadius: '6px',
            backgroundColor: '#fafbff'
          }}>
            <b style={{ fontSize: '1rem', color: '#1a1a1a' }}>{v.position}</b>
            {v.organization && <SubTitle style={{ fontSize: '0.85rem' }}>{v.organization}</SubTitle>}
            {v.startDate && <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>
              {formatDate(v.startDate)} – {v.endDate ? formatDate(v.endDate) : 'Present'}
            </div>}
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
        <SectionTitle>Professional Experience</SectionTitle>
        {work.map((w, idx) => (
          <div key={idx} style={{ 
            marginBottom: 18,
            padding: '14px',
            border: '1px solid #e1e8ff',
            borderRadius: '6px',
            backgroundColor: '#fafbff'
          }}>
            <b style={{ fontSize: '1.1rem', color: '#1a1a1a' }}>{w.position}</b>
            {w.name && <SubTitle style={{ fontSize: '0.95rem', marginTop: '2px' }}>{w.name}</SubTitle>}
            {w.startDate && <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>
              {formatDate(w.startDate)} – {w.endDate ? formatDate(w.endDate) : 'Present'}
            </div>}
            {w.summary && (
              <div style={{ marginTop: 8, color: '#444', fontSize: '0.85rem' }}>{w.summary}</div>
            )}
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
          <div key={idx} style={{ 
            marginBottom: 16,
            padding: '12px',
            border: '1px solid #e1e8ff',
            borderRadius: '6px',
            backgroundColor: '#fafbff'
          }}>
            <b style={{ fontSize: '1rem', color: '#1a1a1a' }}>{e.institution}</b>
            <div style={{ marginTop: '2px', fontSize: '0.9rem' }}>
              {e.studyType && <span style={{ fontWeight: '500' }}>{e.studyType}</span>}
              {e.area && <span>{e.studyType ? ' in ' : ''}{e.area}</span>}
            </div>
            {e.startDate && (
            <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '2px' }}>
              {formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'Present'}
            </div>
            )}
            {e.score && (
              <div style={{ marginTop: '6px', color: '#667eea', fontWeight: '500', fontSize: '0.85rem' }}>
                GPA: {e.score}
              </div>
            )}
            {e.courses && e.courses.length > 0 && (
              <EduList>
                <b>Relevant Coursework:</b>{' '}
                <span style={{ color: '#444', fontSize: '0.85rem' }}>{e.courses.join(', ')}</span>
              </EduList>
            )}
            {e.highlights && e.highlights.length > 0 && (
              <KeyAchievements>
                Achievements:
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

  const sectionOrder = resume.sections || ["Profile", "Education", "Work", "Skills", "Projects", "Volunteer", "Awards"];

  return (
    <>
      <Header>
        <Name>{basics.name}</Name>
        <Contact>
          {basics.location?.city}, {basics.location?.region}
          {basics.phone && (
            <>
              {' '}•{' '}
              <a 
                href={`tel:${basics.phone}`} 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {formatPhone(basics.phone)}
              </a>
            </>
          )}
          {basics.email && (
            <>
              {' '}•{' '}
              <Email href={`mailto:${basics.email}`}>{basics.email}</Email>
            </>
          )}
          {basics.url && (
            <>
              {' '}•{' '}
              <a 
                href={basics.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {basics.url}
              </a>
            </>
          )}
        </Contact>
      </Header>
      <Main $fontFamily={getFontFamily(resume.font)}>
        {sectionOrder.map((section) => sectionsMap[section] || null)}
      </Main>
    </>
  );
};

export default AcademicModernResume; 