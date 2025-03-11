### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###
### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###
### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###
### ONLY RUN THIS IF YOU KNOW WHAT YOU ARE DOING ###

from app import create_app
from models import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as conn:
        conn.execute(text('''
            CREATE TABLE function_calls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id INTEGER NOT NULL,
                function_name VARCHAR(100) NOT NULL,
                inputs JSON NOT NULL,
                outputs JSON NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (message_id) REFERENCES message (id)
            )
        '''))
        conn.commit() 