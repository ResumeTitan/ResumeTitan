import React from 'react';

const SpinnerSmall: React.FC = () => (
  <div>
    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="10" strokeOpacity="0.2" />
      <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="10" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="75" transform="rotate(-90 50 50)">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

export default SpinnerSmall;
