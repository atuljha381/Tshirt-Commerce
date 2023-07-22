import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const EMAIL_HOST: any = process.env.EMAIL_HOST;
const EMAIL_PORT: any = process.env.EMAIL_PORT;
const EMAIL_USERNAME: any = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD: any = process.env.EMAIL_PASSWORD;

const sendEmail = async (options: any) => {
  //1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
    //Activate in gmail "less secure app" option
  });

  //2)Define the email options
  const mailOptions = {
    from: "Test Guy <admin@tsc.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  //3)Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
