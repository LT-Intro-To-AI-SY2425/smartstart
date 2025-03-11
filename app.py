import logging
from flask import Flask
from flask_cors import CORS
from models import db

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # Import and register blueprints
        from routes.chat import chat_bp
        app.register_blueprint(chat_bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5050, debug=True)
