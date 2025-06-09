from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings
from gradio_client import Client

@csrf_exempt
def textProcessing(request):
    if request.method == 'POST':
        python_data = json.loads(request.body)
        # print(data)
        # print(type(data))

        json_data = json.dumps(python_data)
        # print(json_data)
        # print(type(json_data))

        hf_api_key = settings.HUGGINGFACE_API_KEY
        hf_repo_name = settings.HUGGINGFACE_REPO_NAME

        client = Client(hf_repo_name, hf_token=hf_api_key)
        result = client.predict(
            json_input_data = json_data,
            api_name="/predict"
        )

        # print(result)
        # print(type(result))

        result = json.loads(result)
        # print(type(result2))

        # generally it takes python dict as input
        # as output is a list, hence need to set safe=False
        return JsonResponse(result)
    return JsonResponse({"error": "Only POST allowed"}, status=400)