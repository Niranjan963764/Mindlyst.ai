import librosa
import numpy as np
import pandas as pd
import joblib
import os
from sklearn.preprocessing import StandardScaler


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.normpath(os.path.join(BASE_DIR, "models_folder"))
MODEL_PATH = os.path.join(MODEL_DIR, "audio_model_mfcc.pkl")
print(MODEL_PATH)


# Load model only once when module is imported
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None



# -------------------------- Audio Model here -------------------------------- 
def extract_mfcc_sequence(file_path, n_mfcc=13, max_len=100):
    y, sr = librosa.load(file_path, sr=None)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)

    # Pad or truncate to fixed length
    if mfcc.shape[1] < max_len:
        pad_width = max_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode='constant')
    else:
        mfcc = mfcc[:, :max_len]

    return mfcc.T  # Shape: (max_len, n_mfcc)

def predict_audio_emotion(path):
    print("Inside the testing function")
    
    if model is None:
        print("Model not loaded correctly!")
        return "Model not available"
        
    try:
        x = []
        mfcc = extract_mfcc_sequence(path)
        x.append(mfcc)

        X = np.array(x)
        
        # Make prediction
        y_pred=model.predict(X.reshape(1,100,13))
        
        # print(f"Prediction shape: {predictions.shape}, Result: {y_pred}")
        
        # Map prediction to emotion label if needed
        mappings = {'neutral': 0, 'happy': 1, 'sad': 2, 'angry': 3, 'fear': 4, 'disgust': 5, 'surprised': 6, 'calm' :7}
        
        index=int(np.argmax(y_pred))
        emotion = list(mappings.keys())[index]
        return emotion
            
    except Exception as e:
        # Get detailed error info
        import traceback
        error_details = traceback.format_exc()
        print(f"Detailed error: {error_details}")
        
        # Return error message as string
        return f"Error in prediction: {str(e)}"