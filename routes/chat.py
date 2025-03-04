from flask import Blueprint, request, jsonify
from config import PREPROMPT
from services.chat import (
    generate_gemini_response,
    create_new_conversation,
    get_conversation_history,
    save_message
)

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    user_id = data.get("user_id")
    prompt = data.get("prompt")
    
    if prompt is None:
        return jsonify({"error": "Field 'prompt' is required"}), 400

    # Create new user_id if none provided
    if not user_id:
        user_id = create_new_conversation()
    
    # Save user message
    save_message(user_id, "user", prompt)
    
    # Generate response
    conversation = get_conversation_history(user_id)
    if not any(msg["role"] == "system" for msg in conversation):
        conversation.insert(0, {"role": "system", "text": PREPROMPT})

    try:
        response_text = generate_gemini_response(conversation)
        save_message(user_id, "assistant", response_text)
        return jsonify({
            "response_text": response_text,
            "user_id": user_id
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route("/history/<user_id>", methods=["GET"])
def get_history(user_id):
    history = get_conversation_history(user_id)
    return jsonify({"conversation": history})
