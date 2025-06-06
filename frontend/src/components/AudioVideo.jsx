import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AudioVideo = () => {
  // STATES -------------------------
  const [isRecording, setIsRecording] = useState(false);
  const [mediaURL, setMediaURL] = useState(null);
  const [currentChunkAudioPrediction, setCurrentChunkAudioPrediction] = useState('');
  const [currentChunkVideoPrediction, setCurrentChunkVideoPrediction] = useState('');
  const [connected, setConnected] = useState(false);
  const [predictionObtained, setPredictionObtained] = useState(false);

  // REFERENCES ---------------------
  const mediaRecorderRef = useRef(null);
  const mediaChunksRef = useRef([]);
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const shouldContinueRef = useRef(false);
  const videoRef = useRef(null); // Add dedicated video ref

  const setAudioPredictions = useStore((state) => state.setAudioPredictions);
  const setVideoPredictions = useStore((state) => state.setVideoPredictions);
  const audioPredictionsArray = useStore((state) => state.audioPredictionsArray);
  const videoPredictionsArray = useStore((state) => state.videoPredictionsArray);

  const navigate = useNavigate();

  const routeToNextPage = useCallback(() => {
    console.log("audio: ", audioPredictionsArray);
    console.log("video: ", videoPredictionsArray);
    navigate('/dashboard');
    window.location.reload();
  }, [audioPredictionsArray, videoPredictionsArray, navigate]);

  // Memoized WebSocket message handler to prevent recreation on every render
  const handleWebSocketMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received from server:", data);

      if (data.prediction) {
        const audioResult = data.prediction.audio;
        const videoResult = data.prediction.video;
        
        // Batch state updates to reduce re-renders
        setCurrentChunkAudioPrediction(audioResult);
        setCurrentChunkVideoPrediction(videoResult);
        setAudioPredictions(audioResult);
        setVideoPredictions(videoResult);
      } else if (data.message) {
        console.log("Server message:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [setAudioPredictions, setVideoPredictions]);

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/audio_video/`);

    socketRef.current.onopen = () => {
      console.log('Connected to the Server !!!!');
      setConnected(true);
    };

    socketRef.current.onmessage = handleWebSocketMessage;

    socketRef.current.onerror = (error) => {
      console.log(`Socket Error : ${error}`);
    };

    socketRef.current.onclose = (event) => {
      console.log(`Socket Closed: ${event.reason}`);
      setConnected(false);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [handleWebSocketMessage]);

  // Set video source when recording starts/stops
  useEffect(() => {
    if (videoRef.current) {
      if (isRecording && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [isRecording]);

  const startNewRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaChunksRef.current = [];

      shouldContinueRef.current = true;
      setIsRecording(true);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(mediaChunksRef.current, { type: 'video/webm' });
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(videoBlob);
        }

        if (shouldContinueRef.current) {
          startNewRecorder();
        }
      };

      mediaRecorderRef.current.start();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, 3000);
    } catch (error) {
      console.error('Error starting MediaRecorder:', error);
    }
  };

  const stopRecording = () => {
    shouldContinueRef.current = false;
    setIsRecording(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    mediaChunksRef.current = [];

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'recording_stopped' }));
    }
    setPredictionObtained(true);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-900 font-sans px-4 py-8">
      <div className="bg-gray-800 mt-10 shadow-2xl rounded-2xl p-6 w-full max-w-md transition-all duration-300 ease-in-out border border-gray-700 text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Real-Time Emotion Tracker</h2>
          <span className={`flex items-center gap-2 text-sm font-medium ${connected ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`h-3 w-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition duration-200"
              style={{ backgroundColor: 'red' }}
            >
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startNewRecorder}
              disabled={!connected}
              className={`${connected
                  ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  : 'bg-gray-500 cursor-not-allowed'
                } text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-200`}
              style={{ backgroundColor: 'green' }}
            >
              Start Recording
            </button>
          )}
        </div>

        <div className="flex justify-center mb-6">
          {isRecording ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="mx-auto rounded-md mt-4"
              width="400"
            />
          ) : (
            <div className="w-full max-w-sm aspect-video rounded-lg border border-gray-600 bg-gray-700 shadow-sm"></div>
          )}
        </div>

        <div className="text-center mb-4">
          <h4 className="text-white font-semibold mb-2">Live Prediction</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p><span className="font-medium text-cyan-400">Audio:</span> {currentChunkAudioPrediction || '—'}</p>
            <p><span className="font-medium text-pink-400">Video:</span> {currentChunkVideoPrediction || '—'}</p>
          </div>
        </div>

        {predictionObtained && (
          <div className="flex justify-center mt-10">
            <button
              onClick={routeToNextPage}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Proceed to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioVideo;