/**
 * Sends an OTP (One-Time Password) to the provided phone number using Twilio Verify service.
 * @param {string} phoneNumber - The phone number to which the OTP will be sent (without the country code).
 * @param {string} messageChannel - The channel through which the OTP will be sent (e.g., 'sms' for text message).
 * @returns {void} - This function doesn't return anything, as the OTP is sent asynchronously.
 */
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

/**
 * Verifies the provided OTP (One-Time Password) for the given phone number using Twilio Verify service.
 * @param {string} phoneNumber - The phone number to which the OTP was sent (without the country code).
 * @param {string} otp - The OTP code to be verified.
 * @returns {void} - This function doesn't return anything, as the verification is done asynchronously.
 */
export const verifyOTP = (phoneNumber: any, otp: any) => {
  client.verify.v2.services(PHONE_SERVICE_SID).verificationChecks.create({
    to: `+91${phoneNumber}`,
    code: otp,
  });
};
