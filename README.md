# Details about folders
- **frontend**:- contains frontend code
- **backend**:- contains backend code
- **text and video api**:- .rar file contains the api to the distilBERT model, .zip files contains the api to video model
---

# Starting the Project (Here it contains the flow to deploy the text model on huggingface and video model on github codespaces)
1. List of Apps to download - Nodejs, ffmpeg, Docker for redis
2. Start the docker and then start the redis server (as redis required by django channels)
3. Setting up frontend => to install frontend dependenceis and start vite server
 - `cd frontend`
 - `npm i`
 - 'npm run dev`
4. Setting up backend
   - `cd backend`
   - create a .env file and insert these variables into it
     - `HUGGINGFACE_REPO_NAME= insert the hugging face repo name here`
     - `HUGGINGFACE_API_KEY= insert the read access token to the above repo here`
     - `GITHUB_CODESPACE_VIDEO_API= insert the api url of video running on github codespace here`
  - `pip install -r requirements.txt` => to install all dependencies
  - `daphne -b 0.0.0.0 -p 8000 backend.asgi:application` => to run the django asgi server

---
### Text API
- if using it on the hugging face then ensure your codespace is actively running

---
### Video API
- if using it on github codespaces then can do following
- Commands
  - `docker-compose build` => to build images. not start container
  - `docker-compose up` => to build images + start container.
  - `docker-compose down` => stop and remove container, volume, network
  - `docker-compose stop` => stop running container. but container, volume, network intact
  - `docker-compose start` => to start previously stop containers without rebuilding
