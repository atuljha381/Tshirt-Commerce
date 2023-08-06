const accountSID = process.env.PHONE_ACCOUNT_SID;
const accountToken = process.env.PHONE_AUTH_TOKEN;
const client = require("twilio")(accountSID, accountToken);

exports.sendOtpToPhoneNumber = (phoneNumber, messageChannel) => {
  client.verify.v2
    .services(process.env.PHONE_SERVICE_SID)
    .verifications.create({
      to: `+91${phoneNumber}`,
      channel: `${messageChannel}`,
    })
    .then((otpSent) => {
      console.log(otpSent.status)
    }).catch(error => {
      console.error("Error verifying OTP:", error.message);
    });
};

exports.verifyOTP = (phoneNumber, otp) => {
  client.verify.v2
    .services(process.env.PHONE_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${phoneNumber}`,
      code: otp,
    })
    .then((verificationCheck) => {
      console.log(verificationCheck.status);
    })
    .catch((error) => {
      console.error("Error verifying OTP:", error.message);
    });
};
