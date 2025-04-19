import io
import subprocess
import uuid
import os

def convert_webm_bytes_to_mp4_and_wav_paths(bytes_data: bytes, output_dir='media/temp'):
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Generate unique filenames
    base_filename = str(uuid.uuid4())
    mp4_path = os.path.join(output_dir, f'{base_filename}.mp4')
    wav_path = os.path.join(output_dir, f'{base_filename}.wav')

    # Load bytes into an io.BytesIO buffer
    buffer = io.BytesIO(bytes_data)

    # Convert to .mp4
    ffmpeg_mp4 = subprocess.run([
        'ffmpeg',
        '-y',  # Overwrite if exists
        '-f', 'webm',  # Input format
        '-i', 'pipe:0',  # Read from stdin
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        mp4_path
    ],
    input=buffer.getvalue(),  # send bytes from buffer
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
    )

    if ffmpeg_mp4.returncode != 0:
        raise RuntimeError(f"FFmpeg MP4 conversion failed: {ffmpeg_mp4.stderr.decode()}")

    # Reset buffer for next read
    buffer.seek(0)

    # Convert to .wav (extract audio)
    ffmpeg_wav = subprocess.run([
        'ffmpeg',
        '-y',
        '-f', 'webm',
        '-i', 'pipe:0',
        '-vn',  # no video
        '-acodec', 'pcm_s16le',
        '-ar', '44100',
        '-ac', '2',
        wav_path
    ],
    input=buffer.getvalue(),
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
    )

    if ffmpeg_wav.returncode != 0:
        raise RuntimeError(f"FFmpeg WAV conversion failed: {ffmpeg_wav.stderr.decode()}")

    return mp4_path, wav_path
