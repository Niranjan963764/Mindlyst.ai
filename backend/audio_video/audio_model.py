import librosa
import numpy as np
import pandas as pd
import joblib
import os
from sklearn.preprocessing import StandardScaler


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.normpath(os.path.join(BASE_DIR, "models_folder"))
MODEL_PATH = os.path.join(MODEL_DIR, "audio_model.pkl")
print(MODEL_PATH)


# Load model only once when module is imported
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None



# -------------------------- Audio Model here -------------------------------- 
def audio_features_input(file_path):
    features = {}
    
    # Load audio file
    y, sr = librosa.load(file_path, sr=None)  # Load with original sampling rate
    
    # Calculate duration
    # features['duration'] = librosa.get_duration(y=y, sr=sr)
    
    # 1. Sampling Rate
    features['sampling_rate'] = sr

    # 2. Fundamental Frequency (F0)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    f0 = pitches[magnitudes > np.median(magnitudes)]  # Extract prominent pitches
    features['fundamental_frequency_mean'] = np.mean(f0) if f0.size > 0 else 0
    features['fundamental_frequency_std'] = np.std(f0) if f0.size > 0 else 0

    # 3. Energy (RMS)
    rms = librosa.feature.rms(y=y)
    features['rms_energy_mean'] = np.mean(rms)
    features['rms_energy_std'] = np.std(rms)

    # 4. Zero-Crossing Rate (ZCR)
    zcr = librosa.feature.zero_crossing_rate(y)
    features['zero_crossing_rate_mean'] = np.mean(zcr)
    features['zero_crossing_rate_std'] = np.std(zcr)

    # 5. Spectral Centroid
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    features['spectral_centroid_mean'] = np.mean(spectral_centroid)
    features['spectral_centroid_std'] = np.std(spectral_centroid)

    # 6. Spectral Bandwidth
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    features['spectral_bandwidth_mean'] = np.mean(spectral_bandwidth)
    features['spectral_bandwidth_std'] = np.std(spectral_bandwidth)

    # 7. Spectral Roll-Off
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    features['spectral_rolloff_mean'] = np.mean(spectral_rolloff)
    features['spectral_rolloff_std'] = np.std(spectral_rolloff)

    # 8. MFCCs (Mel-Frequency Cepstral Coefficients)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    for i, mfcc in enumerate(mfccs):
        features[f'mfcc_{i+1}_mean'] = np.mean(mfcc)
        features[f'mfcc_{i+1}_std'] = np.std(mfcc)

    # 9. Chroma Features
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    features['chroma_mean'] = np.mean(chroma)
    features['chroma_std'] = np.std(chroma)

    # 10. Spectral Contrast
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    features['spectral_contrast_mean'] = np.mean(spectral_contrast)
    features['spectral_contrast_std'] = np.std(spectral_contrast)

    # 11. Pitch Variability
    features['pitch_variability'] = np.std(f0) if f0.size > 0 else 0

    # 12. Dynamic Temporal Changes
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    features['dynamic_changes_mean'] = np.mean(onset_env)
    features['dynamic_changes_std'] = np.std(onset_env)

    # 13. Tempo
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    features['tempo'] = tempo

    return features

def predict_audio_emotion(path):
    print("Inside the testing function")
    
    if model is None:
        print("Model not loaded correctly!")
        return "Model not available"
        
    try:
        # Extract features
        input1 = audio_features_input(path)
        input1 = pd.DataFrame(input1, index=[0])
        
        print(f"Features extracted, shape: {input1.shape}")
        print(f"Columns: {input1.columns.tolist()}")
        
        # Since your model was trained with 47 columns (including non-numeric ones),
        # we need to match that structure but only scale the numeric columns
        
        # Create a scaler and fit it to our data
        scaler = StandardScaler()
        
        # Scale features - only numeric columns
        numeric_columns = input1.select_dtypes(include=['int64', 'float64']).columns
        input1[numeric_columns] = scaler.fit_transform(input1[numeric_columns])
        
        # Convert to numpy array
        input1_np = input1.values
        
        # Reshape to match LSTM input shape
        # Assuming your model expects shape (samples, time_steps, features)
        input1_reshaped = input1_np.reshape(input1_np.shape[0], 1, input1_np.shape[1])
        
        print(f"Reshaped input shape: {input1_reshaped.shape}")
        
        # Make prediction
        predictions = model.predict(input1_reshaped)
        y_pred = np.argmax(predictions, axis=1)
        
        print(f"Prediction shape: {predictions.shape}, Result: {y_pred}")
        
        # Map prediction to emotion label if needed
        emotion_map = {
            0: "angry",
            1: "disgust", 
            2: "fear",
            3: "happy",
            4: "neutral",
            5: "sad",
            6: "surprise"
        }
        
        # Convert to emotion label if mapping exists
        if len(y_pred) > 0 and y_pred[0] in emotion_map:
            emotion = emotion_map[y_pred[0]]
            return emotion
        else:
            return y_pred.tolist()
            
    except Exception as e:
        # Get detailed error info
        import traceback
        error_details = traceback.format_exc()
        print(f"Detailed error: {error_details}")
        
        # Return error message as string
        return f"Error in prediction: {str(e)}"