from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, UTC

db = SQLAlchemy()

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(36), nullable=False)
    title = db.Column(db.String(200), nullable=True)
    messages = db.relationship('Message', backref='conversation', lazy=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    role = db.Column(db.String(10), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
    function_calls = db.relationship(
        'FunctionCall', backref='message', lazy=True, cascade='all, delete-orphan'
    )

    __table_args__ = (
        db.UniqueConstraint('id', name='unique_message_id'),
    )

class CommodityFutures(db.Model):
    __tablename__ = 'commodity_futures'
    
    Date = db.Column(db.DateTime, primary_key=True)
    NATURAL_GAS = db.Column(db.Float)
    GOLD = db.Column(db.Float)
    WTI_CRUDE = db.Column(db.Float)
    BRENT_CRUDE = db.Column(db.Float)
    SOYBEANS = db.Column(db.Float)
    CORN = db.Column(db.Float)
    COPPER = db.Column(db.Float)
    SILVER = db.Column(db.Float)
    LOW_SULPHUR_GAS_OIL = db.Column(db.Float)
    LIVE_CATTLE = db.Column(db.Float)
    SOYBEAN_OIL = db.Column(db.Float)
    ALUMINUM = db.Column(db.Float)
    SOYBEAN_MEAL = db.Column(db.Float)
    ZINC = db.Column(db.Float)
    ULS_DIESEL = db.Column(db.Float)
    NICKEL = db.Column(db.Float)
    WHEAT = db.Column(db.Float)
    SUGAR = db.Column(db.Float)
    GASOLINE = db.Column(db.Float)
    COFFEE = db.Column(db.Float)
    LEAN_HOGS = db.Column(db.Float)
    HRW_WHEAT = db.Column(db.Float)
    COTTON = db.Column(db.Float)

class FunctionCall(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('message.id'), nullable=False)
    function_name = db.Column(db.String(100), nullable=False)
    inputs = db.Column(db.JSON, nullable=False)
    outputs = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))

class Headlines(db.Model):
    __tablename__ = 'headlines'
    
    id = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.DateTime, nullable=False)
    Publication = db.Column(db.String(200), nullable=False)
    Headline = db.Column(db.Text, nullable=False)
    URL = db.Column(db.String(500), nullable=False) 