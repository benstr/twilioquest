from flask import Flask, request, redirect, json
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)
todos = ["walk the dog"]

@app.route("/sms", methods=['POST'])
def sms():
  if request.headers['Content-Type'].startswith('application/x-www-form-urlencoded') and request.form and request.form["Body"] :
    
    todoCmd = request.form["Body"]
    twiml = MessagingResponse()

    if todoCmd.lower().startswith("add"):
      todos.append(todoCmd[4:])
      twiml.message("New todo has been added")

    elif todoCmd.lower().startswith("remove"):
      todoNum = int(todoCmd[7:])
      todos.pop(todoNum - 1)
      twiml.message("Removed todo #" + str(todoNum))

    elif todoCmd.lower().startswith("list"):
      message = ""
      i = 1

      for todo in todos:
        message += (str(i) + ". " + str(todo) + "\n")
        i+=1

      twiml.message(
        message,
        action='https://90592977.ngrok.io/status', 
        method='POST'
      )

    else:
      twiml.message("Oops, I do not know how to handle your request.")

    return str(twiml)
    
  else:
    print("error return triggered!!")
    return "415 Unsupported Media Type"

@app.route("/status", methods=['POST'])
def status():
  msgSig = request.headers['x-twilio-signature']
  msgId = request.form['MessageSid']
  msgStatus = request.form['SmsStatus']
  statusMsg = 'Twilio Signature: %s\nMessage ID: %s\nStatus: %s\n\r' % (msgSig, msgId, msgStatus)
  
  print(statusMsg)
  return statusMsg

app.run(debug=True, port=3000)