import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the GENAI_API_KEY environment variable")

client = genai.Client(api_key=api_key)
MODEL = "gemini-1.5-flash"
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
        stream = client.models.generate_content_stream(
            model=MODEL,
            contents=full_conversation,
        )
        
        response_text = ""
        for token in stream:
            print(token.text, end="", flush=True)
            response_text += token.text
        print()
        
        # Append the assistant response to memory
        conversation.append({"role": "assistant", "text": response_text})

    except KeyboardInterrupt:
        break