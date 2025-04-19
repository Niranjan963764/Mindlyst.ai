from .audio_model import predict_audio_emotion
from .video_model import predict_video_emotion
from .conversion import convert_webm_bytes_to_mp4_and_wav_paths
from asgiref.sync import sync_to_async
import os

@sync_to_async
def inference(bytes_data):
    # 1. store bytes data into io file
    # 2. then call the conversion code here
    mp4_path, wav_path = convert_webm_bytes_to_mp4_and_wav_paths(bytes_data)
    
    
    # call the function
    data = {}
    data["audio"] = predict_audio_emotion(wav_path)
    data["video"] = predict_video_emotion(mp4_path)

    try:
        os.remove(mp4_path)
        os.remove(wav_path)
    except:
        print("Error removing files: {e}")

    return data