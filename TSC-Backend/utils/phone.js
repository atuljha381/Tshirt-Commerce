const accountSid = process.env.PHONE_SID;
const authToken = process.env.PHONE_TOKEN;
const client = require("twilio")(accountSid, authToken);

client.verify.v2.services
  .create({ to: "+917877447616", channel: "sms" })
  .then((service) => console.log(service.sid));
