import React from 'react';

export default function ResumeContainer({ children }: { children: React.ReactNode}) {
  return (
    <div id={"print-resume"} className="origin-top transition-all duration-300 ease-linear print:!scale-100">
      <div className="w-[210mm] h-[296mm] bg-white my-0 mx-auto">
      {children}
      </div>
    </div>
  );
};
