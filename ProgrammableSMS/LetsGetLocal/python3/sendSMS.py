import os
from twilio.rest import Client
from datetime import datetime
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__),'../../..', '.env')
load_dotenv(dotenv_path)

account = os.environ.get("TWILIO_API_KEY")
token = os.environ.get("TWILIO_API_SECRET")
client = Client(account, token)

message = client.messages.create(
  to=os.environ.get("TWILIO_TO_NUMBER"), 
  from_=os.environ.get("TWILIO_FROM_NUMBER"), 
  body="Greetings! The current time is: %s TK7DHOV9S029FJ9" % datetime.now()
)

print(message)