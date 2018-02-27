from flask import Flask, request, redirect, json
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

@app.route("/sms", methods=['POST'])
def response():

  if request.headers['Content-Type'].startswith('application/x-www-form-urlencoded') and request.form and request.form["From"] :
    # Start our TwiML response
    twiml = MessagingResponse()
    # Add a message
    twiml.message("Hi! It looks like your phone number was born in %s" % request.form["FromCountry"])

    return str(twiml)
    
  else:
    return "415 Unsupported Media Type"

app.run(debug=True, port=3000)