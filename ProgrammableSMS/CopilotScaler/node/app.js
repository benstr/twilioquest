const twilio = require('twilio')
const findUp = require('find-up')
const dotenv = require('dotenv')

dotenv.config({
  path: findUp.sync('.env')
});

const client = new twilio(process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET)
const service = client.messaging.services(process.env.TWILIO_MSG_SERVICE_SID);

// List numbers associated with service
service.phoneNumbers.list()
  .then(response => {

    if(response.length < 6) {
      // release the previous numbers
      const removeNumbers = response.map(number => {
        return client.incomingPhoneNumbers(number.sid).remove()
      })

      Promise.all(removeNumbers)

      return false
    }

    return true
  }).then((haveNumbers) => {

    if(!haveNumbers) {
      // purchase 6 numbers in different states
      const states = ["CA","TX","CO","IL","FL","NY"]

      // find and purchase a number in each state
      const addNumbers = states.map(state => {
        return client.availablePhoneNumbers('US')
            .local.list({
              inRegion: state,
            })
            .then(availablePhoneNumbers => {
              const number = availablePhoneNumbers[0]
              return client.incomingPhoneNumbers.create({
                phoneNumber: number.phoneNumber,
              })
            })
            .then(purchasedNumber => {
              // associate the new number to the copilot service
              service.phoneNumbers.create({phoneNumberSid: purchasedNumber.sid})
                .then(response => {
                  console.log(response)
                }).catch(error => {
                  console.log(error)
                })
            }).catch(error => {console.log(error)})
      })

      Promise.all(addNumbers)
    }
  }).then(() => {
    // send 10 messages to 2 numbers
    const msgArray = Array.from(new Array(10), (x,i) => i)
    const sendMessages = msgArray.map(i => {
      return client.messages.create({
          messagingServiceSid: process.env.TWILIO_MSG_SERVICE_SID,
          to: process.env.TWILIO_TO_NUMBER,
          body: `Message ${i} from Twilio Copilot Service.`,
        })
        .then(message => console.log(message))
        .then(() => {
          client.messages.create({
            messagingServiceSid: process.env.TWILIO_MSG_SERVICE_SID,
            to: process.env.TWILIO_TO_NUMBER_2,
            body: `Message ${i} from Twilio Copilot Service.`,
          })
          .then(message2 => console.log(message2))
        })
    })

    Promise.all(sendMessages)

  }).catch(error => {console.log(error)})