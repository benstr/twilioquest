const express = require('express')
const bodyParser = require('body-parser')
const MessagingResponse = require('twilio').twiml.MessagingResponse

const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/sms', function (req, res) {
  if (!req.body || !req.body.From) return res.sendStatus(415)

  const twiml = new MessagingResponse()

  twiml.message(`Hi! It looks like your phone number was born in ${ req.body.FromCountry }`)

  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

app.listen(3000, () => console.log('Express listening on port 3000'))