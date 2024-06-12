import React, { useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Tooltip from 'components/Tooltip';
import 'styles/index.css';

function Summary ({ summary, aiLoading, onUpdate, onAiCall }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSummaryChange = (e) => {
    const { value } = e.target;
    onUpdate(value);
  }

  const handleSaveSummary = () => {
    setIsEditing(false);
    onUpdate(summary);
  }

  return (
    <div key="summary-editor" className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
        <div className="form-text-main hover:bg-slate-500" onClick={() => {setIsEditing(true)}}>
          {/* <Tooltip message={"Note: this will be automatically generated when clicking \"Generate Resume\""}> */}
            <div>{"Summary"}</div>
          {/* </Tooltip> */}
        </div>

      {isEditing && (
        <div className="px-4 pb-4">
          <div className="w-full pr-2">
            <div className="py-2">
              <button
                className="green-button bg-slate-800 p-2"
                onClick={handleSaveSummary}
              >
                {"Save"}
              </button>
              <button
                className="green-button py-1 px-4 mx-1 bg-slate-800"
                onClick={onAiCall}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2"/>
                  <span>Write with AI</span>
                </div>
              </button>
            </div>
            <div className="flex">
              <textarea 
                type="text"
                id={"summary"}
                className="form-style w-full h-48"
                placeholder=""
                value={summary || ''}
                onChange={handleSummaryChange}
                required 
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Summary;
