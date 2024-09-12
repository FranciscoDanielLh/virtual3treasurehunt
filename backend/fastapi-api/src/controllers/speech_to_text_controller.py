import cloudinary
import cloudinary.uploader
import os
import requests

from openai import OpenAI
from src.settings import OPENAI_API_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, TMP_ROUTE

client = OpenAI(api_key=OPENAI_API_KEY)
          
cloudinary.config( 
  cloud_name = CLOUD_NAME, 
  api_key = API_KEY_CLOUDINARY, 
  api_secret = API_SECRET_CLOUDINARY
)


class SpeechToTextController:
    @staticmethod
    def speech_to_text(url: str):

        file_location = os.path.join(TMP_ROUTE, "temp_files_speech_to_text.wav")
        response = requests.get(url)
        response.raise_for_status()

        with open(file_location, 'wb') as f:
            f.write(response.content)
        
        audio_file = open(file_location, "rb")

        text = client.audio.transcriptions.create(
          model="whisper-1", 
          file=audio_file, 
          response_format="text"
        )

        return {"text": text}

