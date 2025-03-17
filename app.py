import logging
import colorlog
from flask import Flask
from flask_cors import CORS
from models import db

def setup_logging():
    formatter = colorlog.ColoredFormatter(
        "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        log_colors={
            'DEBUG': 'cyan',
            'WARNING': 'yellow',
            'ERROR': 'red',
            'CRITICAL': 'bold_red',
        }
    )

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)

def create_app():
    app = Flask(__name__)
    CORS(app)

    setup_logging()
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
        # Import and register blueprints
        from routes.chat import chat_bp
        app.register_blueprint(chat_bp)

    logging.info("Flask application initialized successfully!")

    return app

if __name__ == "__main__":
    app = create_app()
    logging.info("Starting Flask server on port 5050...")
    app.run(host="0.0.0.0", port=5050, debug=True)
