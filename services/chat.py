from config import client, MODEL
from functions.commodities import get_available_dates, get_available_commotities, get_closest_date_commodity_price
from functions.headlines import search_headlines_by_keyword, get_headlines_by_date_range, get_related_headlines
from models import db, Conversation, Message
import uuid
import logging

logger = logging.getLogger(__name__)

def generate_gemini_response(conversation):
    """
    Given a conversation list (each element is a dict with 'role' and 'text'),
    build a transcript and generate a response from the Gemini model.
    
    Returns:
        tuple: (response_text, function_calls)
        - response_text: The text response from the model
        - function_calls: List of function call objects containing name, inputs, and outputs
    """
    full_conversation = "\n".join(
        f"{msg['role']}: {msg['text']}" for msg in conversation
    )
    
    response = client.models.generate_content(
        model=MODEL,
        contents=full_conversation,
        config={
            'tools': [
                get_available_dates, 
                get_available_commotities, 
                get_closest_date_commodity_price,
                search_headlines_by_keyword,
            ],
        }
    )
    
    function_calls = []
    pending_calls = {}
    call_counter = 0
    
    for content in response.automatic_function_calling_history:
        logger.debug(f"Processing content with {len(content.parts)} parts")
        
        for part in content.parts:
            try:
                if hasattr(part, 'function_call') and part.function_call:
                    call_id = f"{part.function_call.name}_{call_counter}"
                    call_counter += 1
                    pending_calls[call_id] = {
                        'function_name': part.function_call.name,
                        'inputs': part.function_call.args,
                        'outputs': None,
                        'response_name': None
                    }
                    logger.debug(f"added pending call {call_id}: {part.function_call.name}")
                    
                elif hasattr(part, 'function_response') and part.function_response:
                    matching_calls = [
                        (call_id, call) for call_id, call in pending_calls.items()
                        if call['function_name'] == part.function_response.name and call['outputs'] is None
                    ]
                    
                    if matching_calls:
                        call_id, call = matching_calls[0]
                        call['outputs'] = part.function_response.response
                        function_calls.append(call.copy())
                        logger.debug(f"matched and completed call {call_id}: {call['function_name']}")
                        del pending_calls[call_id]
                    else:
                        logger.warning(f"received response for {part.function_response.name} but no matching call found")
                
            except Exception as e:
                logger.error(f"error processing function call: {str(e)}")
                
        logger.debug(f"current function calls collected: {len(function_calls)}")
    
    return response.text, function_calls

def create_new_conversation(title=None):
    """Create a new conversation and return its UUID"""
    user_id = str(uuid.uuid4())
    conversation = Conversation(user_id=user_id, title=title)
    db.session.add(conversation)
    db.session.commit()
    return user_id

def update_conversation_title(user_id, title):
    """Update the title of the most recent conversation for a user"""
    conversation = Conversation.query.filter_by(user_id=user_id).order_by(Conversation.created_at.desc()).first()
    if conversation:
        conversation.title = title
        db.session.commit()
        return True
    return False

def get_conversation_details(user_id):
    """Get conversation details including title, messages, and function calls"""
    conversation = Conversation.query.filter_by(user_id=user_id).first()
    if not conversation:
        return None
    
    messages = []
    for msg in conversation.messages:
        message_data = {
            "role": msg.role,
            "text": msg.text
        }
        
        if msg.function_calls:
            message_data["function_calls"] = [{
                "function_name": call.function_name,
                "inputs": call.inputs,
                "outputs": call.outputs
            } for call in msg.function_calls]
        
        messages.append(message_data)
    
    return {
        "title": conversation.title,
        "messages": messages
    }

def get_conversation_history(user_id):
    """Get all messages for a user's conversations"""
    conversations = Conversation.query.filter_by(user_id=user_id).all()
    history = []
    for conv in conversations:
        for msg in conv.messages:
            history.append({
                "role": msg.role,
                "text": msg.text
            })
    return history

def save_message(conversation_id, role, text):
    """
    Save a message to the database and return the created Message object.
    
    Args:
        conversation_id: The ID of the conversation
        role: The role of the message sender (user/assistant)
        text: The message text
    
    Returns:
        Message: The created message object, or None if creation failed
    """
    try:
        # verify the conversation exists
        conversation = Conversation.query.filter_by(user_id=conversation_id).first()
        if not conversation:
            logger.error(f"Conversation {conversation_id} not found")
            return None
            
        # create and save the message
        message = Message(
            conversation_id=conversation.id,
            role=role,
            text=text
        )
        db.session.add(message)
        db.session.commit()
        
        logger.debug(f"saved message for conversation {conversation_id}: {message.id}")
        return message
        
    except Exception as e:
        logger.error(f"error saving message: {str(e)}")
        db.session.rollback()
        return None
