import React, { useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
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
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  // Detect supported mime type once on mount
  // TODO fix on ios
  const mimeType = getSupportedMimeType() || undefined;
  // if (!mimeType || isIOSSafari()) {
  //   // If not supported or on iOS Safari, render nothing (no mic button)
  //   return null;
  // }

  const handleStart = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Audio recording is not supported in this browser.');
        return;
      }

      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;

      // Create RecordRTC instance
      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 44100,
        // For better iOS compatibility
        bufferSize: 4096,
        // Use WebAudio API for better compatibility
        useWebAudioAPI: true
      });

      recorderRef.current = recorder;
      recorder.startRecording();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current || !recording) return;

    try {
      setRecording(false);
      setLoading(true);

      // Stop recording
      recorderRef.current.stopRecording(() => {
        // Get the recorded blob
        const audioBlob = recorderRef.current.getBlob();
        
        // Create form data
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        // Send to speech-to-text API
        api.post('/speech/speech-to-text', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(res => {
          const data = res.data;
          if (data.transcript) {
            onTranscript(data.transcript);
          } else {
            alert('No transcript returned.');
          }
        })
        .catch(err => {
          console.error('Speech-to-text error:', err);
          alert('Speech-to-text failed.');
        })
        .finally(() => {
          // Clean up
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          if (recorderRef.current) {
            recorderRef.current.destroy();
            recorderRef.current = null;
          }
          setLoading(false);
        });
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert('Failed to stop recording.');
      setLoading(false);
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