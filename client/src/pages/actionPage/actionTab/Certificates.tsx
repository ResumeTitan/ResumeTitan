import React, { useEffect, useState, ChangeEvent } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import 'styles/index.css';

interface CertificatesProps {
  initCertificates: string[];
  aiLoading: boolean;
  onUpdate: (certificates: string[]) => void;
  onAiCall: () => void;
}

const Certificates: React.FC<CertificatesProps> = ({ initCertificates, aiLoading, onUpdate, onAiCall }) => {
  const [certificates, setCertificates] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleCertificatesChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newCertificates = [...certificates];
    newCertificates[index] = value;
    setCertificates(newCertificates);
  }

  const handleAddCertificates = () => {
    setCertificates([...certificates, '']);
  }

  const handleCertificatesDelete = (index: number) => {
    const newCertificates = [...certificates];
    newCertificates.splice(index, 1);
    setCertificates(newCertificates);
  }

  const handleSaveCertificates = () => {
    setIsEditing(false);
    onUpdate(certificates);
  }

  useEffect(() => {
    setCertificates(initCertificates);
  }, [initCertificates]);

  useEffect(() => {}, [aiLoading]);

  return (
    <div className={`${aiLoading ? "animate-pulse" : ""} form-container`}>
      <div className="form-single-header" onClick={() => { setIsEditing(true) }}>{"Certificates"}</div>

      {isEditing && (
        <div className="p-4">
          <div className="flex justify-between">
            <button
              className="green-button p-1"
              onClick={handleSaveCertificates}
            >
              {"Save"}
            </button>
            <div className="flex justify-center">
              <button
                className="green-button p-1 mr-1"
                onClick={handleAddCertificates}
              >
                {"Add"}
              </button>
              <button
                className="green-button p-1"
                onClick={onAiCall}
              >
                <div>
                  <AutoAwesomeIcon className="pr-2" />
                  <span>Write with AI</span>
                </div>
              </button>
            </div>
          </div>
          <div className="w-full py-2">
            {certificates.map((item, index) => (
              <div className="flex justify-between p-1" key={index}>
                <input
                  type="text"
                  id={"certificates"}
                  className="form-style"
                  placeholder=""
                  value={item || ''}
                  onChange={(e) => handleCertificatesChange(e, index)}
                  required />
                <div className="pl-2">
                  <button
                    className="remove-content-button"
                    onClick={() => handleCertificatesDelete(index)}
                  >
                    {"X"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificates;
