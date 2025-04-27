import requests

def predict_video_emotion(path):
    try:
        url = "https://urban-space-guide-jv4jrjjqq79cw65-8000.app.github.dev/predict"
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