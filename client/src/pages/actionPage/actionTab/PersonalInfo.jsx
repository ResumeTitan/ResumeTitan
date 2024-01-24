import React, { useState, useEffect } from 'react';

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

  useEffect (() => {
    setInfoForm(initialInfo);
  }, [initialInfo]);

  return (
    <div className="form-container">
    <div className="font-bold border-b border-black rounded-t p-4">{"Personal Info"}</div>

      {isEditing ? (
        <div className="">

          <div className="p-4 left-right-spacing">
            <div className="w-full pr-2">
            <label htmlFor={"firstName"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
            <input 
              type="text"
              id={"firstName"}
              className="formStyle"
              placeholder="Enter first name..."
              value={infoForm.firstName || ''}
              onChange={handleInfoChange}
              required />
            </div>
            <div className="w-full pl-2">
            <label htmlFor={"lastName"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
            <input 
              type="text"
              id={"lastName"}
              className="formStyle"
              placeholder="Enter last name..."
              value={infoForm.lastName || ''}
              onChange={handleInfoChange}
              required />
            </div>
          </div>

          <div className="p-4">
            <label htmlFor={"phone"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
            <input 
              type="tel"
              id={"phone"}
              className="formStyle" 
              placeholder="123-456-7890"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={handleInfoChange}
              value={infoForm.phone || ''}
              required />
          </div>

          <div className="p-4">
            <label htmlFor={"email"} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
            <input 
              type="email"
              id={"email"}
              className="formStyle" 
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
            {infoForm.firstName} {infoForm.lastName}
          </div>
          <div className="pt-2 flex justify-between">
            {infoForm.phone}
          </div>
          <div className="flex justify-between">
            {infoForm.email}
          </div>
        </div>
      )}

    </div>
  );
}

export default PersonalInfo;
