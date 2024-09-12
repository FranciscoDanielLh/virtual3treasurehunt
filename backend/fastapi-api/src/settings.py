from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
CLOUD_NAME=os.environ["CLOUD_NAME"]
API_KEY_CLOUDINARY=os.environ["API_KEY_CLOUDINARY"]
API_SECRET_CLOUDINARY=os.environ["API_SECRET_CLOUDINARY"]

TMP_ROUTE = os.path.abspath("src/tmp")