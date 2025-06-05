import React, { useEffect, useState } from 'react';
import { BasicsType } from 'types/types';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Define the component's props using the BasicsType interface
interface PersonalInfoProps {
  initialInfo: BasicsType;
  onUpdate: (info: BasicsType) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ initialInfo, onUpdate }) => {
  const getInitialState = (info: BasicsType) => ({
    ...info,
    name: info.name || '',
    email: info.email || '',
    phone: info.phone || '',
    url: info.url || '',
    summary: info.summary || '',
    location: {
      address: info.location?.address || '',
      city: info.location?.city || '',
      region: info.location?.region || '',
      postalCode: info.location?.postalCode || '',
      countryCode: info.location?.countryCode || ''
    },
    profiles: info.profiles || []
  });

  const [infoForm, setInfoForm] = useState<BasicsType>(getInitialState(initialInfo));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleProfileChange = (index: number, field: string, value: string) => {
    const updatedProfiles = [...(infoForm.profiles || [])];
    updatedProfiles[index] = { ...updatedProfiles[index], [field]: value };
    setInfoForm({
      ...infoForm,
      profiles: updatedProfiles
    });
  };

  const handleAddProfile = () => {
    const newProfile = { network: '', username: '', url: '' };
    setInfoForm({
      ...infoForm,
      profiles: [...(infoForm.profiles || []), newProfile]
    });
  };

  const handleRemoveProfile = (index: number) => {
    const updatedProfiles = (infoForm.profiles || []).filter((_, i) => i !== index);
    setInfoForm({
      ...infoForm,
      profiles: updatedProfiles
    });
  };

  const handleSaveInfo = () => {
    setIsEditing(false);
    onUpdate(infoForm);
  };

  const handleCancel = () => {
    setInfoForm(getInitialState(initialInfo));
    setIsEditing(false);
  };

  useEffect(() => {
    setInfoForm(getInitialState(initialInfo));
  }, [initialInfo]);

  return (
    <div className="form-container">
      <div className="form-text-main">{"Personal Info"}</div>
      {isEditing ? (
        <div className="px-4 pb-4">
          <div className="m-2">
            {/* Name - Required */}
            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Full Name</label>
              </div>
            </div>
            <input
              type="text"
              id="name"
              className="form-style"
              placeholder="Enter your full name"
              value={infoForm.name || ''}
              onChange={handleInfoChange}
              required
            />

            {/* Email - Required */}
            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Email Address</label>
              </div>
            </div>
            <input
              type="email"
              id="email"
              className="form-style"
              placeholder="example@email.com"
              value={infoForm.email || ''}
              onChange={handleInfoChange}
              required
            />

            {/* Phone - Required */}
            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Phone Number</label>
              </div>
            </div>
            <input
              type="tel"
              id="phone"
              className="form-style"
              placeholder="(123) 456-7890"
              value={infoForm.phone || ''}
              onChange={handleInfoChange}
              required
            />

            {/* Website URL - Optional */}
            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Website/Portfolio URL</label>
              </div>
            </div>
            <input
              type="url"
              id="url"
              className="form-style"
              placeholder="https://your-website.com"
              value={infoForm.url || ''}
              onChange={handleInfoChange}
            />

            {/* Location Section */}
            <div className="left-right-spacing my-2">
              <div className="flex items-center">
                <label className="form-label-text">Location</label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  id="city"
                  className="form-style"
                  placeholder="City"
                  value={infoForm.location?.city || ''}
                  onChange={handleLocationChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="region"
                  className="form-style"
                  placeholder="State/Province"
                  value={infoForm.location?.region || ''}
                  onChange={handleLocationChange}
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  id="postalCode"
                  className="form-style"
                  placeholder="Postal Code"
                  value={infoForm.location?.postalCode || ''}
                  onChange={handleLocationChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="countryCode"
                  className="form-style"
                  placeholder="Country Code (US, CA, etc.)"
                  value={infoForm.location?.countryCode || ''}
                  onChange={handleLocationChange}
                />
              </div>
            </div> */}

            {/* Profiles Section */}
            <div className="left-right-spacing my-2">
              <div className="flex items-center justify-between">
                <label className="form-label-text">Social Profiles</label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={handleAddProfile}
                >
                  <AddIcon fontSize="small" />
                  Add Profile
                </button>
              </div>
            </div>

            {(infoForm.profiles || []).map((profile, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Profile {index + 1}</span>
                  <button
                    type="button"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleRemoveProfile(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    className="form-style"
                    placeholder="Platform (LinkedIn, GitHub, etc.)"
                    value={profile.network || ''}
                    onChange={(e) => handleProfileChange(index, 'network', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-style"
                    placeholder="Username"
                    value={profile.username || ''}
                    onChange={(e) => handleProfileChange(index, 'username', e.target.value)}
                  />
                  <input
                    type="url"
                    className="form-style"
                    placeholder="Profile URL"
                    value={profile.url || ''}
                    onChange={(e) => handleProfileChange(index, 'url', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="left-right-spacing">
            <button
              className="remove-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="add-button-small"
              onClick={handleSaveInfo}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="form-secondary-area" onClick={() => setIsEditing(true)}>
          <div className="flex items-center justify-between">
            <div className="flex-grow">
              <div className="font-bold text-lg">{infoForm.name || 'No name provided'}</div>
              
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span>{infoForm.email || 'Not provided'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span>{infoForm.phone || 'Not provided'}</span>
                </div>
                
                {infoForm.url && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Website:</span>
                    <span className="text-blue-600 truncate">{infoForm.url}</span>
                  </div>
                )}
                
                {(infoForm.location?.city || infoForm.location?.region || infoForm.location?.address) && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span>
                      {[infoForm.location.address, infoForm.location.city, infoForm.location.region, infoForm.location.countryCode]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}
                
                {/* {(infoForm.profiles || []).length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Profiles:</span>
                    <div className="mt-1 space-y-1">
                      {(infoForm.profiles || []).map((profile, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{profile.network}:</span> {profile.username || profile.url}
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
            
            <button 
              className="green-button px-6 py-2 border border-1 min-w-[100px]" 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalInfo;
