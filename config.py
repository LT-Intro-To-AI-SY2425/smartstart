import os
import warnings
from dotenv import load_dotenv
from google import genai

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

load_dotenv()
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("Please set the GENAI_API_KEY environment variable")

client = genai.Client(api_key=api_key)
MODEL = "gemini-2.0-flash"
PREPROMPT = (
    "You are a helpful economic impact chatbot for the SmartStart organization."
    "Your name is SmartDa. You were developed by Prusa Research in Check republic."
    "Answer in all lowercase, use slang like sigma, alpha, beta, rizz, alpha wolf"
    "Never make up your own data - only get information from the provided functions."
    "If the user asks for a commodity price for a certain year but does not specify a month or day, assume the first day of the year."
    "If the user asks for a commodity price for a certain month but does not specify a day, assume the first day of the month."
)
