import React, { useRef, useState } from 'react';
import api from 'api/actions';

// Select the best supported audio MIME type for MediaRecorder
function getSupportedMimeType() {
  const possibleTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/mpeg',
    'audio/wav'
  ];
  for (const type of possibleTypes) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return '';
}

// Detect iOS Safari
function isIOSSafari() {
  return (
    /iP(ad|hone|od)/.test(navigator.userAgent) &&
    /WebKit/.test(navigator.userAgent) &&
    !/CriOS/.test(navigator.userAgent)
  );
}

const AudioRecorder = ({ onTranscript, disabled }) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Detect supported mime type once on mount
  const mimeType = getSupportedMimeType() || undefined;
  if (!mimeType || isIOSSafari()) {
    // If not supported or on iOS Safari, render nothing (no mic button)
    return null;
  }

  const handleStart = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Audio recording is not supported in this browser.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    audioChunksRef.current = [];
    const mediaRecorder = new window.MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = async () => {
      setLoading(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      try {
        const res = await api.post('/speech/speech-to-text', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res.data;
        if (data.transcript) {
          onTranscript(data.transcript);
        } else {
          alert('No transcript returned.');
        }
      } catch (err) {
        alert('Speech-to-text failed.');
      }
      // Stop all tracks to release the mic
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setLoading(false);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const handleStop = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`relative p-2 rounded-full border font-bold w-16 h-16 flex items-center justify-center transition-colors ${
          recording ? 'bg-green-200 border-green-600 text-green-900' : 'bg-gray-100 border-gray-400'
        }`}
        onClick={recording ? handleStop : handleStart}
        disabled={loading || disabled}
        title={recording ? 'Stop recording' : 'Record answer'}
        aria-label={recording ? 'Stop recording' : 'Record answer'}
        style={{ minWidth: '4rem', minHeight: '4rem' }}
      >
        {/* Spinner animation when loading */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              style={{ zIndex: 1 }}
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#22c55e"
                strokeWidth="6"
                strokeDasharray="31 100"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        )}
        <span
          role="img"
          aria-label="mic"
          className="text-4xl"
          style={{ zIndex: 2, position: 'relative' }}
        >
          🎤
        </span>
      </button>
    </div>
  );
};

export default AudioRecorder; 