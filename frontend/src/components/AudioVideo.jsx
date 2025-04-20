import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const AudioVideo = () => {
  // STATES -------------------------
  // Whether recording has started or not.
  const [isRecording, setIsRecording] = useState(false);
  // URL for the entire recording (if needed).
  const [mediaURL, setMediaURL] = useState(null);
  // For displaying the current prediction (if any).
  const [currentChunkAudioPrediction, setCurrentChunkAudioPrediction] = useState('');
  const [currentChunkVideoPrediction, setCurrentChunkVideoPrediction] = useState('');
  // Whether we are connected to the WebSocket.
  const [connected, setConnected] = useState(false);
  // To store predictions for all the chunks (not used in this snippet).
  const audioOutputs = [];
  const videoOutputs = [];

  // REFERENCES ---------------------
  // MediaRecorder reference.
  const mediaRecorderRef = useRef(null);
  // Array to store recording chunks.
  const mediaChunksRef = useRef([]);
  // WebSocket reference.
  const socketRef = useRef(null);
  // MediaStream reference, so we can stop it when done.
  const streamRef = useRef(null);
  // A ref to control continuous recording (i.e. whether to restart the recorder).
  const shouldContinueRef = useRef(false);

  const [predictionObtained, setPredictionObtained] = useState(false);

  const setAudioPredictions = useStore((state) => state.setAudioPredictions)
  const setVideoPredictions = useStore((state) => state.setVideoPredictions)
  const audioPredictionsArray = useStore((state) => state.audioPredictionsArray)
  const videoPredictionsArray = useStore((state) => state.videoPredictionsArray)
   

  const navigate = useNavigate();
  const routeToNextPage = () => {
    // console.log("audio: ", audioPredictionsArray)
    // console.log("video: ", videoPredictionsArray)
    navigate('/dashboard')
    window.location.reload()
  }
  useEffect(() => {
    // Establish a WebSocket connection and set event handlers.
    socketRef.current = new WebSocket(`ws://${window.location.hostname}:8000/ws/audio_video/`);

    // When the connection opens, mark as connected.
    socketRef.current.onopen = () => {
      console.log('Connected to the Server !!!!');
      setConnected(true);
    };

    // When a message from the server arrives.
    socketRef.current.onmessage = (event) => {

      // 1. PRINTING THE OUTPUT
      // console.log(event.data);
      // You can update prediction state here if needed.
      // setCurrentChunkPrediction(event.data);
      // outputs.push(event.data);

      // 2. DISPLAYING PREDICTION
      try {
        const data = JSON.parse(event.data)
        console.log("Received from server:", data)

        if (data.prediction) {
          // setCurrentChunkPrediction(data.prediction.audio)
          const audioResult = data.prediction.audio
          const videoResult = data.prediction.video
          setCurrentChunkAudioPrediction(audioResult)
          setCurrentChunkVideoPrediction(videoResult)
          // audioOutputs.push(audioResult)
          // videoOutputs.push(videoResult)
          setAudioPredictions(audioResult)
          setVideoPredictions(videoResult)
        }
        else if (data.message) {
          console.log("Server message:", data.message)
        }
      }
      catch (error) {
        console.error("Error:", error)
      }
    };

    // Log any WebSocket errors.
    socketRef.current.onerror = (error) => {
      console.log(`Socket Error : ${error}`);
    };

    // On socket close, mark as disconnected.
    socketRef.current.onclose = (event) => {
      console.log(`Socket Closed: ${event.reason}`);
      setConnected(false);
    };

    // Clean up the WebSocket when the component unmounts.
    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000);
      }

      // Stop any ongoing recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Stop all media tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Function to start a new recording segment.
  // at start we get permission and start recording
  // then .start() gets executed
  // then as we added 1sec timeout, indicate after 1sec - we close the mediaRecorder
  // as mediaRecorder closed - now events fires
  // first the browser fires all of the ondataavailable events - that is if data present - first flush the internal buffer and send to frontend client
  // then the onstop event gets called - here we can either send a blob for complete video. But here we do another thing that is we keep a reference for the start and stop button clicked, when start button clicked we make shouldContinueRef = true, and later on the onstop we check whether it's still true
  // - if true ===> indicate stop button still not clicked, so we need to continue recording, in this call the recording function again. As we closed the earlier mediaRecorder object, hence create new object for next chunk

  const startNewRecorder = async () => {
    try {
      // Request access to audio and video.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      // Store the media stream reference for later cleanup.
      streamRef.current = stream;
      // Create a new MediaRecorder with our desired MIME type.
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      // Clear any previous chunks.
      mediaChunksRef.current = [];

      // Set the flag to true so that continuous recording continues.
      shouldContinueRef.current = true;
      // Mark state as recording.
      setIsRecording(true);

      // When a data chunk is available, add it to our array.
      mediaRecorderRef.current.ondataavailable = (event) => {
        // Push the chunk if there is any data.
        if (event.data && event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      // When recording stops, combine the chunks into a complete blob
      // and, if we're still in recording mode, restart a new segment.
      mediaRecorderRef.current.onstop = () => {
        // Combine all chunks into a complete blob.
        const videoBlob = new Blob(mediaChunksRef.current, { type: 'video/webm' });
        // Send the complete, self-contained blob to backend via WebSocket.
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(videoBlob);
        }

        // If we are still meant to continue recording, restart a new segment.
        if (shouldContinueRef.current) {
          startNewRecorder();
        }
      };

      // Start recording immediately.
      mediaRecorderRef.current.start();
      // Stop this recorder after 1 second.
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting MediaRecorder:', error);
    }
  };

  const stopRecording = () => {
    // Set the flag to false so that continuous recording stops.
    shouldContinueRef.current = false;
    setIsRecording(false);

    // Stop all tracks on the media stream to release the device.
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        // console.log('Stopping track:', track.kind, track.readyState, track.enabled);
        track.stop();
        // track.enabled = false
        // console.log('Stopping track:', track.kind, track.readyState, track.enabled);
      });
      streamRef.current = null; // Clear the reference
    }

    // If there's a recorder running, stop it.
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null; // Clear the reference
    }

    mediaChunksRef.current = []; // Clear media chunks

    // Optionally, notify the server that recording has been stopped.
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'recording_stopped' }));
    }
    setPredictionObtained(true)
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
              className={` 
              ${connected
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
          {
            isRecording ? (
              <video
                // ref - property to handle direct access to the DOM element. create callback function that receive actual DOM video element as parameter when component renders or updates
                ref={(video) => {
                  // checks if DOM element exists (will be null during unmounting)
                  if (video) {
                    // if currently recording and we have media stream, set video source to display live camera feed
                    if (isRecording && streamRef.current) {
                      video.srcObject = streamRef.current;
                    }
                    // if not recording - clear video source which release the connection between the video element and the media stream
                    else if (!isRecording) {
                      video.srcObject = null; // Clear video source when not recording
                    }
                  }
                }}
                autoPlay
                muted
                className="mx-auto rounded-md mt-4"
                width="400"
              />

            ) : (
              <div className="w-full max-w-sm aspect-video rounded-lg border border-gray-600 bg-gray-700 shadow-sm"></div>
            )
          }
        </div>

        <div className="text-center mb-4">
          <h4 className="text-white font-semibold mb-2">Live Prediction</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p><span className="font-medium text-cyan-400">Audio:</span> {currentChunkAudioPrediction || '—'}</p>
            <p><span className="font-medium text-pink-400">Video:</span> {currentChunkVideoPrediction || '—'}</p>
          </div>
        </div>

        {predictionObtained && (
          <div className="flex justify-center mb-10">
            <button
              onClick={routeToNextPage}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition"
            >
              Proceed to Dashboard
            </button>
          </div>
        )}

        {/* {mediaURL && (
          <div className="mt-6">
            <img src={mediaURL} alt="Recorded video placeholder" className="w-full rounded-lg shadow-md" />
            <p className="text-xs text-gray-400 text-center mt-2">Recorded Audio + Video</p>
          </div>
        )} */}
      </div>
    </div>
  );


};

export default AudioVideo;
