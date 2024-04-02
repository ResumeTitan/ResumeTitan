import React from 'react';

interface DetailsProps {
  label: string;
  description: string;
}

const DetailsExpand: React.FC<DetailsProps> = ({label, description}) => {
  // Component logic goes here
  return (
    <div className="question-options">
      <details className="p-4 rounded-lg transform-gpu delay-75 duration-100 ease-in-out ">
        <summary className="leading-6 text-slate-900 dark:text-white font-semibold select-none">
          {label}
        </summary>
        <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          <p>{description}</p>
        </div>
      </details>
    </div>
  );
};

export default DetailsExpand;