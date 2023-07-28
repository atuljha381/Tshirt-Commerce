// @ts-nocheck
"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOtpToPhoneNumber = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const accountSID = process.env.PHONE_ACCOUNT_SID;
const accountToken = process.env.PHONE_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSID, accountToken);
const PHONE_SERVICE_SID = process.env.PHONE_SERVICE_SID;
const sendOtpToPhoneNumber = (phoneNumber, messageChannel) => {
  client.verify.v2.services(PHONE_SERVICE_SID).verifications.create({
    to: `+91${phoneNumber}`,
    channel: `${messageChannel}`,
  });
};
exports.sendOtpToPhoneNumber = sendOtpToPhoneNumber;
const verifyOTP = (phoneNumber, otp) => {
  client.verify.v2.services(PHONE_SERVICE_SID).verificationChecks.create({
    to: `+91${phoneNumber}`,
    code: otp,
  });
};
exports.verifyOTP = verifyOTP;
