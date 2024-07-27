import React from 'react';

interface VolunteerForm {
  id: string | null;
  // Add other fields as necessary
}

interface VolunteerEditorProps {
  volunteerForm: VolunteerForm;
  handleDeleteVolunteer: () => void;
  handleCancel: () => void;
  handleSaveVolunteer: () => void;
}

const VolunteerEditor: React.FC<VolunteerEditorProps> = ({
  volunteerForm,
  handleDeleteVolunteer,
  handleCancel,
  handleSaveVolunteer,
}) => {
  return (
    <div>
      <div>
        {volunteerForm.id ? (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Click add to start adding accomplishments/skills..."
                disabled
              />
            </div>
          </div>
        ) : (
          <div className="left-right-spacing">
            <div className="w-full pr-2 py-1">
              <textarea
                className="form-style flex-wrap h-24 lg:h-16"
                placeholder="Click add to start adding accomplishments/skills..."
                disabled
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          disabled={!volunteerForm.id}
          className={`${volunteerForm.id ? "remove-button" : "disabled-button"}`}
          onClick={handleDeleteVolunteer}
        >
          {"Delete"}
        </button>
        <button
          className="remove-button"
          onClick={handleCancel}
        >
          {"Cancel"}
        </button>
        <button
          className="add-button-small"
          onClick={handleSaveVolunteer}
        >
          {"Save"}
        </button>
      </div>
    </div>
  );
};

export default VolunteerEditor;
