import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import warnings
from google import genai
import warnings
from api import get_light_values, set_light_values

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

app = Flask(__name__)
CORS(app) 

def generate_gemini_response(conversation):
    """
    Given a conversation list (each element is a dict with 'role' and 'text'),
    build a transcript and generate a response from the Gemini model.
    """
    # Build a single string transcript from the conversation
    full_conversation = "\n".join(
        f"{msg['role']}: {msg['text']}" for msg in conversation
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=full_conversation,
        config={
            # Python functions to be used as tools in the model
            'tools': [set_light_values, get_light_values],
        }
    )
    return response.text

def run_cli_chat():
    """Interactive CLI chat mode."""
    conversation = []
    if PREPROMPT:
        conversation.append({"role": "system", "text": PREPROMPT})
    try:
        while True:
            prompt = input("> ")
            conversation.append({"role": "user", "text": prompt})
            response = generate_gemini_response(conversation)
            print(f"{response}\n")
            conversation.append({"role": "assistant", "text": response})
    except KeyboardInterrupt:
        pass

# Flask API endpoints
@app.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    conversation = data.get("conversation", [])
    prompt = data.get("prompt")
    if prompt is None:
        return jsonify({"error": "Field 'prompt' is required"}), 400

    # Append the new user prompt
    conversation.append({"role": "user", "text": prompt})

    try:
        response_text = generate_gemini_response(conversation)
        # Append the assistant's response to conversation (if desired)
        conversation.append({"role": "assistant", "text": response_text})
        return jsonify({"response_text": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # If a command-line argument 'cli' is passed, run interactive chat
    if len(sys.argv) > 1 and sys.argv[1].lower() == "cli":
        run_cli_chat()
    else:
        app.run(host="0.0.0.0", port=5050, debug=True)