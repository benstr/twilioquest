from flask import Flask, request, redirect, json
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)
todos = ["walk the dog"]

@app.route("/sms", methods=['POST'])
def response():
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

      twiml.message(message)

    else:
      twiml.message("Oops, I do not know how to handle your request.")

    return str(twiml)
    
  else:
    print("error return triggered!!")
    return "415 Unsupported Media Type"

app.run(debug=True, port=3000)