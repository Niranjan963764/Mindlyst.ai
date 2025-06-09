import requests
from django.conf import settings

video_url = settings.GITHUB_CODESPACE_VIDEO_API

def predict_video_emotion(path):
    try:
        url = video_url
        with open(path, "rb") as f:
            files = {"file": ("chunk.mp4", f, "video/mp4")}
            resp = requests.post(url, files=files)
            resp.raise_for_status()
            result = resp.json()['dominant_emotion']
            print(type(result))
            # print("Predicted emotion:", result)
            print("Response : ", resp)
            print("Result :", result)
            return result
    except Exception as e:
        print(e)