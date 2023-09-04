const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
var hbs = require("nodemailer-express-handlebars");

let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_APP_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});
const handlebarOptions = {
  viewEngine: {
    extName: ".ejs",
    partialsDir: path.resolve("./app/util/views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./app/util/views"),
  extName: ".ejs",
};

transport.use("compile", hbs(handlebarOptions));

const generateAndSendEmail = async (data) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL, // Sender address
    to: `${data?.to}`, // List of recipients
    subject: data?.subject, // Subject line
    template: "join-event-email",
    context: {
      title: data?.title,
      text: data?.text,
      link: data?.link,
      buttonText: data?.buttonText,
    },
    attachments: [
      {
        filename: "Eventsrack-black.png",
        path: __dirname + "/images/Eventsrack-black.png",
        cid: "myImg",
      },
    ],
  };

  transport.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = { generateAndSendEmail };
