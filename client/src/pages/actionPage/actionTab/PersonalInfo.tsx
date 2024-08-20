import React, { useEffect, useState } from 'react';
import { BasicsType } from 'types/types';

// Define the component's props using the BasicsType interface
interface PersonalInfoProps {
  initialInfo: BasicsType;
  onUpdate: (info: BasicsType) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ initialInfo, onUpdate }) => {
  const [infoForm, setInfoForm] = useState<BasicsType>(initialInfo);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handling info change", infoForm);
    const { id, value } = e.target;
    setInfoForm({ ...infoForm, [id]: value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInfoForm({
      ...infoForm,
      location: { ...infoForm.location, [id]: value }
    });
  };

  // const handleProfileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   const updatedProfiles = infoForm.profiles.map((profile, i) => 
  //     i === index ? { ...profile, [id]: value } : profile
  //   );
  //   setInfoForm({
  //     ...infoForm,
  //     profiles: updatedProfiles
  //   });
  // };

  const handleSaveInfo = () => {
    setIsEditing(false);
    onUpdate(infoForm);
  };

  useEffect(() => {
    setInfoForm(initialInfo);
  }, [initialInfo]);

  return (
    <div className="form-container">
      <div className="form-text-main">{"Personal Info"}</div>
      {isEditing ? (
        <div className="p-4">
          <div className="pb-2">
            <label htmlFor="name" className="form-label-text">Name</label>
            <input
              type="text"
              id="name"
              className="form-style"
              placeholder="Enter name..."
              value={infoForm.name}
              onChange={handleInfoChange}
              required
            />
          </div>

          <div className="pb-2">
            <label htmlFor="label" className="form-label-text">Label</label>
            <input
              type="text"
              id="label"
              className="form-style"
              placeholder="Enter label..."
              value={infoForm.label}
              onChange={handleInfoChange}
            />
          </div>

          <div className="pb-2">
            <label htmlFor="phone" className="form-label-text">Phone Number</label>
            <input
              type="tel"
              id="phone"
              className="form-style"
              placeholder="123-456-7890"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={handleInfoChange}
              value={infoForm.phone}
              required
            />
          </div>

          <div className="pb-2">
            <label htmlFor="email" className="form-label-text">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-style"
              placeholder="example@website.com"
              onChange={handleInfoChange}
              value={infoForm.email}
              required
            />
          </div>

          <div className="pb-2">
            <label htmlFor="url" className="form-label-text">Website URL</label>
            <input
              type="url"
              id="url"
              className="form-style"
              placeholder="https://example.com"
              onChange={handleInfoChange}
              value={infoForm.url}
            />
          </div>

          <div className="pb-2">
            <label className="form-label-text">Location</label>
            <div className="pl-2">
              <input
                type="text"
                id="city"
                className="form-style"
                placeholder="City"
                onChange={handleLocationChange}
                value={infoForm.location.city}
              />
              <input
                type="text"
                id="countryCode"
                className="form-style"
                placeholder="State"
                onChange={handleLocationChange}
                value={infoForm.location.countryCode}
              />
            </div>
          </div>

          {/* {infoForm.profiles.map((profile, index) => (
            <div key={index} className="pb-2">
              <label className="form-label-text">Profile {index + 1}</label>
              <input
                type="text"
                id="network"
                className="form-style"
                placeholder="Network"
                onChange={(e) => handleProfileChange(index, e)}
                value={profile.network}
              />
              <input
                type="text"
                id="username"
                className="form-style"
                placeholder="Username"
                onChange={(e) => handleProfileChange(index, e)}
                value={profile.username}
              />
              <input
                type="url"
                id="url"
                className="form-style"
                placeholder="Profile URL"
                onChange={(e) => handleProfileChange(index, e)}
                value={profile.url}
              />
            </div>
          ))} */}

          <div className="text-right p-2">
            <button
              className="add-button-small"
              onClick={handleSaveInfo}
            >
              {"Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="form-secondary-area" onClick={() => setIsEditing(true)}>
          <div className="flex justify-between font-bold">
            {infoForm.name}
          </div>
          <div className="pt-2 flex justify-between">
            {infoForm.phone}
          </div>
          <div className="flex justify-between">
            {infoForm.email}
          </div>
          <div className="flex justify-between">
            {infoForm.url}
          </div>
          {infoForm.location.city && (
            <div className="flex justify-between">
              {infoForm.location.city}, {infoForm.location.countryCode}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PersonalInfo;
