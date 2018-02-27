const twilio = require('twilio')
const findUp = require('find-up')
const dotenv = require('dotenv')

dotenv.config({
  path: findUp.sync('.env')
});

const accountSid = process.env.TWILIO_API_KEY
const authToken = process.env.TWILIO_API_SECRET

const client = new twilio(accountSid, authToken)

client.messages.create({
  body: `Greetings! The current time is: ${Date.now()} TK7DHOV9S029FJ9`,
  to: process.env.TWILIO_TO_NUMBER,
  from: process.env.TWILIO_FROM_NUMBER
})
.then((message) => console.log(message.sid))