import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import 'styles/index.css';

interface InterviewPrintOptionsProps {
  onClose: () => void;
  onPrint: (options: PrintOptions) => void;
  hasJobInfo: boolean;
}

export interface PrintOptions {
  includeJobInfo: boolean;
  includeExampleAnswers: boolean;
  includeGuidance: boolean;
  includeMyAnswers: boolean;
}

const InterviewPrintOptions: React.FC<InterviewPrintOptionsProps> = ({ onClose, onPrint, hasJobInfo }) => {
  const [options, setOptions] = useState<PrintOptions>({
    includeJobInfo: hasJobInfo,
    includeExampleAnswers: false,
    includeGuidance: false,
    includeMyAnswers: false
  });

  const handleOptionChange = (option: keyof PrintOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handlePrint = () => {
    onPrint(options);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-400 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Print Options</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Select what you'd like to include in your printed interview questions:
        </div>

        <div className="space-y-3">
          <div className="text-black font-medium">Interview questions will always be included</div>
          
          {hasJobInfo && (
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeJobInfo}
                onChange={() => handleOptionChange('includeJobInfo')}
                className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <span className="text-black">Job Information (title, company, description)</span>
            </label>
          )}

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeExampleAnswers}
              onChange={() => handleOptionChange('includeExampleAnswers')}
              className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <span className="text-black">Example Answers</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeGuidance}
              onChange={() => handleOptionChange('includeGuidance')}
              className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <span className="text-black">Guidance & Tips</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeMyAnswers}
              onChange={() => handleOptionChange('includeMyAnswers')}
              className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <span className="text-black">My Answers</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="secondary-action-button"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="primary-action-button flex items-center gap-2"
          >
            <PrintIcon />
            Print Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrintOptions; 