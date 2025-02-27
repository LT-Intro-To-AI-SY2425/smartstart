import os
from dotenv import load_dotenv
from google import genai
import warnings
from api import get_light_values, set_light_values
from functions import getDateCommodityPrice

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

load_dotenv()
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the GENAI_API_KEY environment variable")

client = genai.Client(api_key=api_key)
MODEL = "gemini-2.0-flash"
PREPROMPT = (
    ""
)

# Initialize conversation memory with a system-facing message
conversation = [{"role": "system", "text": PREPROMPT}]

while True:
    try:
        prompt = input("> ")

        conversation.append({"role": "user", "text": prompt})
        
        # Convert the conversation memory into a single string
        full_conversation = "\n".join(
            f"{msg['role']}: {msg['text']}" for msg in conversation
        )

        # Send the full conversation string to the streaming endpoint
        stream = client.models.generate_content(
            model=MODEL,
            contents=full_conversation,
            config = {
                'tools': [getDateCommodityPrice],
            }
        )
        
        print(stream.text)
        
        # Append the assistant response to memory
        conversation.append({"role": "assistant", "text": stream.text})

    except KeyboardInterrupt:
        break


