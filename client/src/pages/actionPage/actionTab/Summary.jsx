import React, { useEffect, useState } from 'react';
import Tooltip from 'components/Tooltip';
import 'styles/index.css';

function Summary ({ initSummary, onUpdate }) {
  const [summary, setSummary] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleSummaryChange = (e) => {
    const { value } = e.target;
    setSummary(value);
  }

  const handleSaveSummary = () => {
    setIsEditing(false);
    onUpdate(summary);
  }

  useEffect(() => {
    setSummary(initSummary);
  }, [initSummary]);

  return (
    <div className="form-container">
        <div className="form-text-main hover:bg-slate-500" onClick={() => {setIsEditing(true)}}>
          <Tooltip message={"Note: this will be automatically generated when clicking \"Generate Resume\""}>
            <div>{"Summary"}</div>
          </Tooltip>
        </div>

      {isEditing && (
        <div className="p-4 ">
          <div className="w-full pr-2">
            <div className="flex justify-between">
            <textarea 
              type="text"
              id={"summary"}
              className="form-style w-full h-16"
              placeholder=""
              value={summary || ''}
              onChange={handleSummaryChange}
              required />
              <div className="pl-2">
                <button
                  className="green-button bg-slate-800 p-2"
                  onClick={handleSaveSummary}
                >
                  {"Save"}
                </button>
            </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Summary;
