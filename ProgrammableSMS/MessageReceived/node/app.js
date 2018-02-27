const express = require('express')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}))

let todos = []

app.post('/sms', function (req, res) {
  const body = req.body.Body
  if (!body) return res.sendStatus(415)

  const todoCmd = body.substr(0,body.indexOf(' ')).toLowerCase() || body.toLowerCase()
  const todoMsg = body.substr(body.indexOf(' ')+1)
  const twiml = new MessagingResponse()

  switch(todoCmd) {
    case "add":
      todos.push(todoMsg)

      twiml.message("New todo has been added")
      break
    case "remove":
      todos.splice((parseInt(todoMsg)-1), 1)

      twiml.message(`Removed todo #${todoMsg}`)
      break
    case "list":
      let listMsg = ""

      todos.forEach((todo,i) => {
        const index = i + 1
        listMsg += `${index.toString()}. ${todo}\n`
      })

      twiml.message({
        action: 'https://90592977.ngrok.io/status',
        method: 'POST'
      },listMsg)
      break
    default:
      twiml.message("Oops, I do not know how to handle your request.")
  }

  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())

})

app.post('/status', function (req, res) {
  const statusMsg = `Twilio Signature: ${req.headers["x-twilio-signature"]}\nMessage ID: ${req.body.MessageSid}\nStatus: ${req.body.SmsStatus}\n\r`
  console.log(statusMsg)

  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(statusMsg)
})

app.listen(3000, () => console.log('Express listening on port 3000'))
