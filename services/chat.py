from config import client, MODEL
from functions import get_available_dates, get_available_commotities, get_closest_date_commodity_price
from models import db, Conversation, Message
import uuid

def generate_gemini_response(conversation):
    """
    Given a conversation list (each element is a dict with 'role' and 'text'),
    build a transcript and generate a response from the Gemini model.
    """
    full_conversation = "\n".join(
        f"{msg['role']}: {msg['text']}" for msg in conversation
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=full_conversation,
        config={
            'tools': [get_available_dates, get_available_commotities, get_closest_date_commodity_price],
        }
    )
    return response.text

def create_new_conversation():
    """Create a new conversation and return its UUID"""
    user_id = str(uuid.uuid4())
    conversation = Conversation(user_id=user_id)
    db.session.add(conversation)
    db.session.commit()
    return user_id

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

def save_message(user_id, role, text):
    """Save a new message to the user's current conversation"""
    conversation = Conversation.query.filter_by(user_id=user_id).order_by(Conversation.created_at.desc()).first()
    if not conversation:
        conversation = Conversation(user_id=user_id)
        db.session.add(conversation)
    
    message = Message(conversation_id=conversation.id, role=role, text=text)
    db.session.add(message)
    db.session.commit()
