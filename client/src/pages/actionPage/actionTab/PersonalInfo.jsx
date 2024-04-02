import React, { useEffect, useState } from 'react';

function PersonalInfo ({ initialInfo, onUpdate }) {
  const [infoForm, setInfoForm] = useState(initialInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleInfoChange = (e) => {
    const { id, value } = e.target;
    setInfoForm({ ...infoForm, [id]: value });
  }

  const handleSaveInfo = () => {
    setIsEditing(false);
    onUpdate(infoForm);
  }

  // TODO slow, remove
  useEffect(() => {
    setInfoForm(initialInfo);
  }, [initialInfo])

  return (
    <div className="form-container">
    <div className="form-text-main">{"Personal Info"}</div>

      {isEditing ? (
        <div className="">

          <div className="p-4 left-right-spacing">
            <div className="w-full pr-2">
            <label htmlFor={"name"} className="form-label-text">Name</label>
            <input 
              type="text"
              id={"name"}
              className="form-style"
              placeholder="Enter name..."
              value={infoForm.name}
              onChange={handleInfoChange}
              required />
            </div>
          </div>

          <div className="p-4">
            <label htmlFor={"phone"} className="form-label">Phone Number</label>
            <input 
              type="tel"
              id={"phone"}
              className="form-style" 
              placeholder="123-456-7890"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={handleInfoChange}
              value={infoForm?.phone || ''}
              required />
          </div>

          <div className="p-4">
            <label htmlFor={"email"} className="form-label">Email Address</label>
            <input 
              type="email"
              id={"email"}
              className="form-style" 
              placeholder="example@website.com"
              onChange={handleInfoChange}
              value={infoForm.email || ''}
              required />
          </div>
          <div className="text-right p-2">
            <button
              className="addButton bg-slate-800"
              onClick={handleSaveInfo}
            >
            {"Save"}
          </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-black hover:bg-slate-500" onClick={() => {setIsEditing(true)}}>
          <div className="flex justify-between font-bold">
            {infoForm.name}
          </div>
          <div className="pt-2 flex justify-between">
            {infoForm?.phone || ''}
          </div>
          <div className="flex justify-between">
            {infoForm?.email}
          </div>
        </div>
      )}

    </div>
  );
}

export default PersonalInfo;
