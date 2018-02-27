const twilio = require('twilio')
const findUp = require('find-up')
const dotenv = require('dotenv')

dotenv.config({
  path: findUp.sync('.env')
});

const client = new twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET)

client.messages
  .create({
    messagingServiceSid: process.env.TWILIO_MSG_SERVICE_SID,
    to: process.env.TWILIO_TO_NUMBER,
    body: 'Hello from a Geomatch service!',
  })
  .then(message => console.log(message));