import React, { useEffect, useState, ChangeEvent } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'styles/index.css';
import { ICertificatesType } from 'types/types';

interface CertificatesProps {
  initCertificates: ICertificatesType[];
  onUpdate: (certificates: ICertificatesType[]) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ initCertificates, onUpdate }) => {
  const [certificates, setCertificates] = useState<ICertificatesType[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newCertificates = [...certificates];
    newCertificates[index].name = value;
    setCertificates(newCertificates);
  }

  const handleIssuerChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newCertificates = [...certificates];
    newCertificates[index].issuer = value;
    setCertificates(newCertificates);
  }

  const handleDateChange = (date: string, index: number) => {
    const newCertificates = [...certificates];
    newCertificates[index].date = date;
    setCertificates(newCertificates);
  }

  const handleAddCertificates = () => {
    setCertificates([...certificates, {name: '', issuer: '', date: Date()}]);
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

  return (
    <div className={`form-container`}>
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
            </div>
          </div>
          <div className="w-full py-2">
            {certificates.map((cert, index) => (
              <div className={`flex justify-between p-1 ${index > 0 ? "border-t-2 border-black" : ""}`} key={index}>
                <div className="w-full py-2">
                <label className="form-label">{"Certificate Name"}</label>
                <input
                  type="text"
                  id={"cert-name"}
                  className="form-style"
                  placeholder=""
                  value={cert.name || ''}
                  onChange={(e) => handleNameChange(e, index)}
                  required 
                />
                <div>
                  <label className="form-label">{"Issuer"}</label>
                  <input
                    type="text"
                    id={"certificates"}
                    className="form-style"
                    placeholder=""
                    value={cert.issuer || ''}
                    onChange={(e) => handleIssuerChange(e, index)}
                    required 
                  />
                  <div className="py-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker', 'DatePicker']}>
                    <DatePicker
                      label="Date Issued"
                      value={dayjs(cert.date)}
                      onChange={(newValue: any) => {handleDateChange(newValue.toString(), index)}}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                </div>
                </div>
                </div>
                <div className="pl-2 content-center">
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
        </div>
      )}
    </div>
  );
}

export default Certificates;
