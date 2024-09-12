import cloudinary
import cloudinary.uploader
import os

from openai import OpenAI
from src.settings import OPENAI_API_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, TMP_ROUTE

client = OpenAI(api_key=OPENAI_API_KEY)
          
cloudinary.config( 
  cloud_name = CLOUD_NAME, 
  api_key = API_KEY_CLOUDINARY, 
  api_secret = API_SECRET_CLOUDINARY
)


class TextToSpeechController:
    @staticmethod
    def text_to_speech(text: str):

        file_location = os.path.join(TMP_ROUTE, "temp_files_text_to_speech.wav")

        response = client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            response_format="wav",
            input=text
        )
        response.write_to_file(file_location)

        audio_response = cloudinary.uploader.upload(
            file_location,
            resource_type = 'video'
        )

        url = audio_response["url"]

        return {"text": text, "url": url}

