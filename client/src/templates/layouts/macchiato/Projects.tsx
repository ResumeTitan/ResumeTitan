import React from 'react';
import styled from 'styled-components';
import Section from './Section';
import { ProjectType } from 'types/types';
import { HighlightsList, HighlightItem } from './Resume';

interface ProjectsProps {
  projects: ProjectType[];
}

const ProjectsSection = styled.div`
  margin-bottom: 20px;
`;

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  if (!projects || !projects.length) return null;

  return (
    <ProjectsSection>
      <Section title="Projects">
        {projects.map((project, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4 style={{ 
              fontFamily: '"Lato", Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              margin: '0 0 4px 0'
            }}>
              {project.name}
              {project.url && (
                <span style={{ marginLeft: '8px' }}>
                  <a 
                    href={project.url} 
                    style={{ 
                      color: '#56817A', 
                      textDecoration: 'none',
                      fontSize: '12px'
                    }}
                  >
                    [View Project]
                  </a>
                </span>
              )}
            </h4>
            <div style={{
              fontFamily: '"Lato", Helvetica, Arial, sans-serif',
              fontSize: '12px',
              color: '#666',
              marginBottom: '8px'
            }}>
              {formatDate(project.startDate)} – {project.endDate ? formatDate(project.endDate) : 'Present'}
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <HighlightsList>
                {project.highlights.map((highlight, idx) => (
                  <HighlightItem key={idx}>{highlight}</HighlightItem>
                ))}
              </HighlightsList>
            )}
          </div>
        ))}
      </Section>
    </ProjectsSection>
  );
};

export default Projects; 