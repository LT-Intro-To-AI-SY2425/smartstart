from flask import Blueprint, request, jsonify
from config import PREPROMPT, TITLE_PROMPT
from services.chat import (
    generate_gemini_response,
    create_new_conversation,
    get_conversation_history,
    save_message,
    update_conversation_title,
    get_conversation_details
)
from models import Message, Conversation, FunctionCall, db
import logging

logger = logging.getLogger(__name__)

chat_bp = Blueprint('chat', __name__)

def error_response(message, status_code=400):
    return jsonify({
        "success": False,
        "error": {
            "message": message,
            "code": status_code
        }
    }), status_code

# stateless version of chat endpoint
@chat_bp.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    if not data:
        return error_response("Invalid JSON data")

    prompt = data.get("prompt")
    conversation = data.get("conversation", [])
    
    if prompt is None:
        return error_response("Field 'prompt' is required")

    conversation.append({"role": "user", "text": prompt})
    
    if not any(msg["role"] == "system" for msg in conversation):
        conversation.insert(0, {"role": "system", "text": PREPROMPT})

    try:
        response_text = generate_gemini_response(conversation)
        
        return jsonify({
            "response_text": response_text
        })
    except Exception as e:
        return error_response(str(e), 500)

@chat_bp.route("/chat/<conversation_id>", methods=["POST"])
def chat_with_id_endpoint(conversation_id):
    data = request.get_json()
    if not data:
        return error_response("Invalid JSON data")

    prompt = data.get("prompt")
    if prompt is None:
        return error_response("Field 'prompt' is required")
    
    # check if conversation exists
    conversation_details = get_conversation_details(conversation_id)
    if not conversation_details:
        return error_response("Conversation not found", 404)
    
    # save user message first and get the message object back
    user_message = save_message(conversation_id, "user", prompt)
    if not user_message:
        return error_response("Failed to save user message", 500)
    
    conversation = get_conversation_history(conversation_id)
    if not any(msg["role"] == "system" for msg in conversation):
        conversation.insert(0, {"role": "system", "text": PREPROMPT})

    try:
        response_text, function_calls = generate_gemini_response(conversation)
        
        # save assistant message and get the message object back
        assistant_message = save_message(conversation_id, "assistant", response_text)
        if not assistant_message:
            return error_response("Failed to save assistant message", 500)
        
        # save function calls
        for call in function_calls:
            if call['function_name']:  # only save if we have a function name
                function_call = FunctionCall(
                    message_id=assistant_message.id,
                    function_name=call['function_name'],
                    inputs=call['inputs'] or {},
                    outputs=call['outputs'] or {}
                )
                db.session.add(function_call)
        
        db.session.commit()
        
        # title generation logic
        generated_title = None
        user_messages = [msg for msg in conversation_details["messages"] if msg["role"] == "user"]
        if len(user_messages) >= 5 and not conversation_details["title"]:
            title_prompt = TITLE_PROMPT + [{"role": "user", "text": str(user_messages[:5])}]
            try:
                generated_title = generate_gemini_response(title_prompt)[0][:50]
                update_conversation_title(conversation_id, generated_title)
            except Exception as e:
                logger.error(f"Failed to generate title: {e}")
        
        response = {
            "response_text": response_text,
            "user_id": conversation_id,
            "function_calls": function_calls if function_calls else []
        }
        
        if generated_title:
            response["title"] = generated_title
            
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return error_response(str(e), 500)

@chat_bp.route("/history/<user_id>", methods=["GET"])
def get_history(user_id):
    conversation_details = get_conversation_details(user_id)
    if not conversation_details:
        return error_response("Conversation not found", 404)
    
    return jsonify({
        "conversation": conversation_details["messages"],
        "title": conversation_details["title"]
    })

@chat_bp.route("/conversations", methods=["POST"])
def create_conversation():
    user_id = create_new_conversation()
    return jsonify({"user_id": user_id})

@chat_bp.route("/conversations/<user_id>", methods=["DELETE"])
def clear_conversation(user_id):
    try:
        # get the conversation to verify it exists
        conversation = Conversation.query.filter_by(user_id=user_id).first()
        if not conversation:
            return error_response("Conversation not found", 404)

        messages = Message.query.filter_by(conversation_id=conversation.id).all()

        # delete function calls associated with messages before deleting messages, no clue why this dosent work in the db model
        # somewhat sure that this is an sqlite thing
        message_ids = [msg.id for msg in messages]
        if message_ids:
            FunctionCall.query.filter(FunctionCall.message_id.in_(message_ids)).delete(synchronize_session=False)

        Message.query.filter_by(conversation_id=conversation.id).delete(synchronize_session=False)

        db.session.delete(conversation)

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Conversation cleared successfully"
        })
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error clearing conversation: {str(e)}")
        return error_response(str(e), 500)
