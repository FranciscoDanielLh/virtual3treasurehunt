import cloudinary
import cloudinary.uploader
import random
import os

from openai import OpenAI
from src.settings import OPENAI_API_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, TMP_ROUTE
from src.arrays import MEXICO_STUFF, POSITIVE_ADJECTIVES

client = OpenAI(api_key=OPENAI_API_KEY)
          
cloudinary.config( 
  cloud_name = CLOUD_NAME, 
  api_key = API_KEY_CLOUDINARY, 
  api_secret = API_SECRET_CLOUDINARY
)


class SuccessGameController:
    @staticmethod
    def create_nft(wallet: str, percentage: str):

        number_1 = random.randint(0, 29)
        number_2 = random.randint(0, 29)

        prompt = MEXICO_STUFF[number_1] + " " + POSITIVE_ADJECTIVES[number_2] + " minimalista"

        if percentage == "100":
            prompt += " de color dorado brillante"
        print(prompt)

        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        
        image_url = response.data[0].url

        return {"text": response.data[0].revised_prompt, "url": image_url}

