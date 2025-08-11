import React, { useState } from 'react';
import ProjectEditor from './ProjectEditor';
import PaletteIcon from '@mui/icons-material/Palette';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import 'styles/index.css';
import { ProjectType } from 'types/types';

interface ProjectsProps {
  projects: ProjectType[];
  onSave: (projectForm: ProjectType) => void;
  onDelete: (id: string) => void;
  onSwap: (up: boolean, index: number) => void;
}

function Projects({ projects, onSave, onDelete, onSwap }: ProjectsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState({});

  const handleSaveProject = (projectForm: ProjectType) => {
    setIsEditing(false);
    onSave(projectForm);
  }

  const handleDeleteProject = (id: string) => {
    setIsEditing(false);
    onDelete(id);
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleEditProject = (index: number) => {
    const foundProject = projects.find(obj => obj.id === index);
    setEditingProject(foundProject || {});
    setIsEditing(true);
  }

  const handleAddProject = () => {
    setIsEditing(true);
    setEditingProject({});
  }

  const handleMoveUp = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (index > 0) {
      onSwap(true, index);
    }
  }

  const handleMoveDown = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (index < projects.length - 1) {
      onSwap(false, index);
    }
  }

  const editingForm = (
    <div className="px-4 pb-4">
      <ProjectEditor editingProject={editingProject} onSave={handleSaveProject} onDelete={handleDeleteProject} onCancel={handleCancel}/>
    </div>
  );

  return (
    <div className="form-container">
      <div className="form-text-main">{"Projects"}</div>
      {isEditing && editingForm}

      {!isEditing && (
        <div>
          {projects.map((project, index) => (
            <div key={`project-${index}`} 
              className="form-secondary-area flex items-center" 
              onClick={() => handleEditProject(project.id)}
            >
              <div className="flex items-center gap-2 mr-4">
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => handleMoveUp(index, e)}
                  disabled={index === 0}
                >
                  <KeyboardArrowUpIcon />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={(e) => handleMoveDown(index, e)}
                  disabled={index === projects.length - 1}
                >
                  <KeyboardArrowDownIcon />
                </button>
              </div>
              <div className="flex-grow">
                <div className="font-bold">
                  {project?.name}
                </div>
              </div>
              <button 
                className="green-button px-6 py-2 border border-1 min-w-[100px]" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditProject(project.id);
                }}
              >
                {"Edit"}
              </button>
            </div>
          ))}
          <div className={`p-4 flex flex-col items-center justify-center add-button`} onClick={handleAddProject}>
            <PaletteIcon fontSize="large"/>
            <span>{"Add Project"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects; 