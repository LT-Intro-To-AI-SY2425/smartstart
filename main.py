import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import warnings
from google import genai
from functions import *

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

load_dotenv()
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the GENAI_API_KEY environment variable")

client = genai.Client(api_key=api_key)
conversation = []
MODEL = "gemini-2.0-flash"
PREPROMPT = (
    "You are a helpful economic impact chatbot for the SmartStart organization."
    "Never make up your own data - only get information from the provided functions."
    "If the user asks for a commodity price for a certain year but does not specify a month or day, assume the first day of the year."
    "If the user asks for a commodity price for a certain month but does not specify a day, assume the first day of the month."
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
            'tools': [get_available_dates, get_closest_date_commodity_price],
        }
    )
    return response.text

def run_cli_chat():
    """Interactive CLI chat mode."""
    try:
        while True:
            prompt = input("> ")
            conversation.append({"role": "user", "text": prompt})
            response = generate_gemini_response(conversation)
            print(response)
            # Append assistant response to conversation for context
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
        conversation.append({"role": "assistant", "text": response_text})
        return jsonify({"response_text": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Initialize the conversation with the preprompt
    if PREPROMPT:
        conversation.append({"role": "system", "text": PREPROMPT})
    # If a command-line argument 'cli' is passed, run interactive chat
    if len(sys.argv) > 1 and sys.argv[1].lower() == "cli":
        run_cli_chat()
    else:
        app.run(host="0.0.0.0", port=5050, debug=True)