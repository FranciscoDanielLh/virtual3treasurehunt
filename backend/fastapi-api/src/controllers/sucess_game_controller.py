import cloudinary
import cloudinary.uploader
import random
import os
import asyncio
import json

from aptos_sdk.account import Account
from aptos_sdk.account_address import AccountAddress
from aptos_sdk.async_client import RestClient

from aptos_sdk.aptos_token_client import (
    AptosTokenClient,
    Collection,
    Object,
    PropertyMap,
    ReadObject,
    Token,
)

from openai import OpenAI
from src.settings import OPENAI_API_KEY, CLOUD_NAME, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY, COLLECTION_NAME, PRIVATE_KEY_HEX
from src.arrays import MEXICO_STUFF, POSITIVE_ADJECTIVES

NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1"

client = OpenAI(api_key=OPENAI_API_KEY)
          
cloudinary.config( 
  cloud_name = CLOUD_NAME, 
  api_key = API_KEY_CLOUDINARY, 
  api_secret = API_SECRET_CLOUDINARY
)


class SuccessGameController:
    @staticmethod
    async def create_nft(wallet: str, percentage: str):

        number_1 = random.randint(0, 29)
        number_2 = random.randint(0, 29)

        name = MEXICO_STUFF[number_1] + " " + POSITIVE_ADJECTIVES[number_2]
        prompt = name + " minimalista"

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

        rest_client = RestClient(NODE_URL)
        token_client = AptosTokenClient(rest_client)

        account = Account.load_key(PRIVATE_KEY_HEX)

        txn_hash = await token_client.mint_token(
            account,
            COLLECTION_NAME,
            response.data[0].revised_prompt,
            name,
            image_url,
            PropertyMap([]),
        )

        await rest_client.wait_for_transaction(txn_hash)

        minted_tokens = await token_client.tokens_minted_from_transaction(txn_hash)
        token_addr = minted_tokens[0]

        txn_hash = await token_client.transfer_token(
            account,
            token_addr,
           AccountAddress.from_str_relaxed(wallet),
        )

        await rest_client.wait_for_transaction(txn_hash)

        await rest_client.close()

        return {"text": response.data[0].revised_prompt, "url": image_url, "token_hash": str(token_addr)}

