import twilio from "twilio";
import * as dotenv from "dotenv";
dotenv.config();

const accountSID = process.env.PHONE_ACCOUNT_SID;
const accountToken = process.env.PHONE_AUTH_TOKEN;
const client = twilio(accountSID, accountToken);

const PHONE_SERVICE_SID: any = process.env.PHONE_SERVICE_SID;

export const sendOtpToPhoneNumber = (phoneNumber: any, messageChannel: any) => {
  client.verify.v2.services(PHONE_SERVICE_SID).verifications.create({
    to: `+91${phoneNumber}`,
    channel: `${messageChannel}`,
  });
};

export const verifyOTP = (phoneNumber: any, otp: any) => {
  client.verify.v2.services(PHONE_SERVICE_SID).verificationChecks.create({
    to: `+91${phoneNumber}`,
    code: otp,
  });
};
