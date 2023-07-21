const accountSID = process.env.PHONE_ACCOUNT_SID;
const accountToken = process.env.PHONE_AUTH_TOKEN;
const client = require("twilio")(accountSID, accountToken);

// client.verify.v2.services
//   .create({ to: "+917877447616", channel: "sms" })
//   .then((service) => console.log(service.sid));

exports.sendOtpToPhoneNumber = (phoneNumber, messageChannel) => {
  client.verify.v2
    .services(process.env.PHONE_SERVICE_SID)
    .verifications.create({
      to: `+91${phoneNumber}`,
      channel: `${messageChannel}`,
    });
};

exports.verifyOTP = (phoneNumber, otp) => {
  client.verify.v2
    .services(process.env.PHONE_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${phoneNumber}`,
      code: otp,
    });
};
