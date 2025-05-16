import React, { useRef, useState } from 'react';

const SpeechToTextTextarea = ({ value, onChange, placeholder = '', className = '', ...props }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleMicClick = () => {
    if (listening) {
      // If already listening, stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
      }
      return;
    }
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch (err) {
      setListening(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <textarea
        className="form-style flex-grow h-full text-sm sm:text-base"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      <button
        type="button"
        className={`mic-button p-2 rounded-full border font-bold w-16 h-16 flex items-center justify-center transition-colors ${listening ? 'bg-green-200 border-green-600 text-green-900' : 'bg-gray-100 border-gray-400'}`}
        onClick={handleMicClick}
        title={listening ? 'Stop recording' : 'Record answer'}
        aria-label={listening ? 'Stop recording' : 'Record answer'}
        style={{ minWidth: '4rem', minHeight: '4rem' }}
      >
        <span role="img" aria-label="mic" className="text-4xl">🎤</span>
      </button>
    </div>
  );
};

export default SpeechToTextTextarea;
