from openai import OpenAI
from src.settings import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)
          


class ChatbotController:
    @staticmethod
    def chatbot_answer(prompt: str, client_tag: str):
        
        response = client.chat.completions.create(
          model="gpt-4-turbo",
          messages=[
            {"role": "system", "content": f'''eres un chatbot avanzado integrado en una plataforma diseñada
              para ayudar a personas con discapacidades a explorar y disfrutar de lugares turísticos accesibles en México. 
             Tu principal función es proporcionar información detallada sobre la accesibilidad de estos sitios, incluyendo 
             detalles sobre entradas sin escalones, rampas, ascensores y baños adaptados. 
             Además, debes poder ayudar a los usuarios a realizar reservaciones en estos lugares y ofrecer guías de audio que describan los puntos de interés turístico.
            Tu objetivo es asegurar que la experiencia turística sea lo más cómoda y enriquecedora posible para los usuarios con discapacidades. 
            Responde a preguntas sobre ubicaciones específicas, disponibilidad de fechas para visitas y proporciona recomendaciones 
            personalizadas basadas en las necesidades de accesibilidad de cada usuario. El usario es {client_tag}'''},
            {"role": "user", "content": prompt}
          ]
        )
        response = response.choices[0].message.content
        return {"answer": response}
        

