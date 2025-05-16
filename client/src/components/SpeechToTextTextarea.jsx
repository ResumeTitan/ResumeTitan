import React, { useRef, useState } from 'react';
import AudioRecorder from './AudioRecorder';

const SpeechToTextTextarea = ({ value, onChange, placeholder = '', className = '', ...props }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <textarea
        className="form-style flex-grow h-full text-sm sm:text-base"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      <AudioRecorder
        onTranscript={transcript => onChange(value ? value + ' ' + transcript : transcript)}
        disabled={false}
      />
    </div>
  );
};

export default SpeechToTextTextarea;
