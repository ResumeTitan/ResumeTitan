import React, { useEffect, useState } from 'react';

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
    console.log('initSummary', initSummary);
    setSummary(initSummary);
  }, [initSummary]);

  return (
    <div className="border border-black border-2 rounded-lg w-full my-4 text-white bg-slate-700">
      <div className="font-bold border-b border-black rounded-t p-4 hover:bg-slate-500" onClick={() => {setIsEditing(true)}}>{"Summary"}</div>

      {isEditing && (
        <div className="p-4 ">
          <div className="w-full pr-2">
            <div className="flex justify-between">
            <textarea 
              type="text"
              id={"summary"}
              className="formStyle"
              placeholder=""
              value={summary || ''}
              onChange={handleSummaryChange}
              required />
              <div className="pl-2">
                <button
                  className="greenButton bg-slate-800"
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
