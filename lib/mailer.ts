import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { Options as MailOptions } from "nodemailer/lib/mailer";

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Resolve the path to the emailTemplates directory
const emailTemplatesPath = path.resolve(process.cwd(), "templates");

// Configure Handlebars options
const handlebarOptions: hbs.NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve(emailTemplatesPath, "partials"),
    layoutsDir: path.resolve(emailTemplatesPath, "layouts"),
    defaultLayout: "", // Use an empty string instead of boolean
  },
  viewPath: emailTemplatesPath,
  extName: ".hbs",
};

// Use Handlebars with Nodemailer
transporter.use("compile", hbs(handlebarOptions));

interface EmailOptions extends MailOptions {
  template: string;
  context: { [key: string]: any };
}

const sendEmail = async ({
  to,
  subject,
  template,
  context,
}: EmailOptions & { to: string[] }): Promise<void> => {
  try {
    const mailOptions: EmailOptions = {
      from: process.env.EMAIL_USER!,
      to: to.join(","), // Join the array of emails into a single string
      subject,
      template,
      context,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
