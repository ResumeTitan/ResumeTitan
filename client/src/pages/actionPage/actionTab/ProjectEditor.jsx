import React, { useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from 'api/actions';
import AIAssistant from 'components/AIAssistant';
import 'styles/index.css';
import { FormContainer } from 'components/Form/styled';
import DateInput from 'components/Form/DateInput';

const suggestions = [
  "Check the spelling and grammar of the second highlight",
  "Revise the top two highlights to make them more concise and impactful",
  "Add quantifiable results to the first highlight to better showcase accomplishments",
  "Remove any vague or non-specific terms from the third highlight",
  "Add quantifiable results to the first highlight to better showcase accomplishments",
  "Reorder the highlights to ensure the most impressive achievements are listed first",
  "Shorten the second highlight while retaining its key points to improve readability"
];

function ProjectEditor({ editingProject, onSave, onDelete, onCancel }) {
  const [projectForm, setProjectForm] = useState(editingProject);
  const [aiLoading, setAiLoading] = useState(false);
  const [endDateChecked, setEndDateChecked] = useState(editingProject.endDateCurrent || false);
  const [aiAssistant, showAiAssistant] = useState(false);
  const [aiAssistantMsg, setAiAssistantMsg] = useState('');
  const [placeholder, setPlaceholder] = useState("Ensure that all highlights follow a consistent format and tone");
  const [isPlaceholderActive, setIsPlaceholderActive] = useState(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  const [brainstormInput, setBrainstormInput] = useState('');

  React.useEffect(() => {
    setProjectForm(editingProject);
    setEndDateChecked(editingProject.endDateCurrent || false);
  }, [editingProject]);

  React.useEffect(() => {
    if (aiAssistant) {
      let index = 0;
      const interval = setInterval(() => {
        setIsPlaceholderActive(false); // Trigger the roll-up animation
        setTimeout(() => {
          setPlaceholder(suggestions[index]); // Change the placeholder text
          setIsPlaceholderActive(true); // Trigger the roll-down animation
          index = (index + 1) % suggestions.length;
        }, 300); // Delay to sync with roll-up animation
      }, 5000); // Change placeholder every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [aiAssistant]);

  const handleSaveProject = () => {
    if (endDateChecked) {
      projectForm.endDate = "";
    }
    onSave(projectForm);
    setProjectForm({});
  }

  const handleDeleteProject = () => {
    onDelete(projectForm.id || -1);
    setProjectForm({});
  }

  const handleCancel = () => {
    onCancel();
    setProjectForm({});
  }

  const handleProjectChange = (e) => {
    const { id, value } = e.target;
    setProjectForm({ ...projectForm, [id]: value });
  }

  const handleProjectHighlightsChange = (highlights, index) => {
    const newForm = { ...projectForm };
    newForm.highlights[index] = highlights;
    setProjectForm(newForm);
  }

  const handleHighlightsDelete = (index) => {
    const newForm = { ...projectForm };
    newForm.highlights.splice(index, 1);
    setProjectForm(newForm);
  }

  const handleEndDateCurrent = () => {
    const endDateCurrent = !endDateChecked;
    setProjectForm({ ...projectForm, endDateCurrent: endDateCurrent });
    setEndDateChecked(!endDateChecked);
  }

  const handleHighlightAdd = () => {
    if (!projectForm.highlights) {
      setProjectForm({ ...projectForm, highlights: [""] });
    } else {
      setProjectForm({ ...projectForm, highlights: [...projectForm.highlights, ""] });
    }
  }

  const handleAiCall = async (userInput = null) => {
    setAiLoading(true);
    try {
      const projectResponse = await api.post("/resume/projects", {
        project: projectForm,
        userInput: userInput,
        operationType: 'edit'
      });
      setProjectForm(prev => ({ ...prev, highlights: projectResponse.data.response.highlights }));
    } catch (error) {
      console.error("Error calling AI:", error);
    } finally {
      setAiLoading(false);
    }
  }

  const handleAiAssistCall = async () => {
    if (aiAssistantMsg.trim()) {
      setAiLoading(true);
      try {
        const projectResponse = await api.post("/resume/projects", {
          project: projectForm,
          userInput: aiAssistantMsg,
          operationType: 'edit'
        });
        setProjectForm(prev => ({ ...prev, highlights: projectResponse.data.response.highlights }));
        setAiAssistantMsg('');
        showAiAssistant(false);
      } catch (error) {
        console.error("Error calling AI:", error);
      } finally {
        setAiLoading(false);
      }
    }
  }

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""}`}>
      <div className="py-4">
        <label htmlFor={"name"} className="form-label-text">Project Name</label>
        <input 
          type="text"
          id={"name"}
          className="form-style" 
          placeholder="Enter project name..."
          onChange={handleProjectChange}
          value={projectForm.name || ''}
          required />
      </div>
      <div className="my-6">
        <label htmlFor={"url"} className="form-label-text">Project URL</label>
        <input 
          type="url"
          id={"url"}
          className="form-style"
          placeholder="https://project.com"
          value={projectForm.url || ''}
          onChange={handleProjectChange}
        />
      </div> 

      <FormContainer>
        <DateInput 
          title='Start Date' 
          value={projectForm.startDate} 
          onChange={(event) => {
            const newDate = event.target.value;
            setProjectForm(prev => ({
              ...prev,
              startDate: newDate
            }));
          }} 
        />
        <DateInput 
          title='End Date' 
          value={projectForm.endDate}
          onChange={(event) => {
            const newDate = event.target.value;
            setProjectForm(prev => ({
              ...prev,
              endDate: newDate
            }));
          }}
          disabled={endDateChecked}
          className={endDateChecked ? "bg-gray-100 opacity-70 rounded" : ""}
        >
          <div className="mt-2">
            <label htmlFor="endDateCheckbox" className="block text-sm">
              Current
            </label>
            <input
              id="endDateCheckbox"
              type="checkbox"
              checked={endDateChecked}
              onChange={handleEndDateCurrent}
              className="mr-2"
            />
          </div>
        </DateInput>
      </FormContainer>

      <div className="">
        <div className="my-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center">
              <label htmlFor={"projectHighlights"} className="form-label-text">Highlights</label>
            </div>
            
            <div className="left-right-spacing">
              <button
                className="primary-action-button"
                onClick={() => showAiAssistant(true)}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>AI Assistant</span>
                </div>
              </button>
              <button
                className="primary-action-button"
                onClick={() => setShowBrainstorm(true)}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>Write with AI</span>
                </div>
              </button>
              <button
                className="primary-action-button"
                onClick={handleHighlightAdd}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        {aiAssistant && (
          <AIAssistant
            placeholder={placeholder}
            isPlaceholderActive={isPlaceholderActive}
            aiAssistantMsg={aiAssistantMsg}
            onMessageChange={setAiAssistantMsg}
            onSubmit={handleAiAssistCall}
            onClose={() => showAiAssistant(false)}
            loading={aiLoading}
          />
        )}

        {projectForm.highlights ? projectForm.highlights.map((item, index) => (
          <div key={index} className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                type="text"
                id={"projectHighlights"}
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Enter project highlights..."
                value={item}
                onChange={(e) => handleProjectHighlightsChange(e.target.value, index)}
              />
            </div>
            <div className="flex items-center">
              <button
                className="remove-content-button"
                onClick={() => handleHighlightsDelete(index)}
              >
                {"X"}
              </button>
            </div>
          </div>
        )) : (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea 
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Click Add or Write with AI to start adding project highlights..."
                disabled
              />
            </div>
          </div>
        )}
      </div>

      <div className="left-right-spacing">
        <button
          disabled={!projectForm.id}
          className={"secondary-action-button"}
          onClick={handleDeleteProject}
        >
          {"Delete"}
        </button>
        <button
          className="secondary-action-button"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
        <button
          className="primary-action-button"
          onClick={handleSaveProject}
        >
          {"Save"}
        </button>
      </div>

      {showBrainstorm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-2">Brainstorm for AI</h2>
            <p className="mb-2 text-sm text-gray-600">Enter your ideas, technologies, or accomplishments to help the AI write your project highlights. Separate items with a comma.</p>
            <p className="mb-2 text-sm text-red-600 font-semibold">Warning: This will overwrite your existing highlights.</p>
            <textarea
              className="form-style w-full h-24 mb-4"
              placeholder="E.g. React, Node.js, Database design, User authentication"
              value={brainstormInput}
              onChange={e => setBrainstormInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="secondary-action-button"
                onClick={() => setShowBrainstorm(false)}
              >
                Cancel
              </button>
              <button
                className="primary-action-button"
                onClick={() => {
                  setShowBrainstorm(false);
                  handleAiCall(brainstormInput);
                  setBrainstormInput('');
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectEditor; 