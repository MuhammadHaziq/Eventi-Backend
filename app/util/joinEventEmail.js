const nodemailer = require("nodemailer");
const ejs = require("ejs");
let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "test",
    pass: "test",
  },
});
const generateAndSendEmail = async (data) => {
  const mailOptions = {
    from: "test@gmail.com", // Sender address
    to: "test@gmail.com", // List of recipients
    subject: "Node Mailer", // Subject line
    text: "Hello People!, Welcome to Bacancy!", // Plain text body
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
