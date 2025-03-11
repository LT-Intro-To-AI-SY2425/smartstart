### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###
### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###
### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###
### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###


from app import create_app
from models import db, Conversation
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as conn:
        conn.execute(text('ALTER TABLE conversation ADD COLUMN title VARCHAR(200)'))
        conn.commit() 