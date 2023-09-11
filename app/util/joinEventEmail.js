const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const fs = require('fs');
const ejs = require("ejs");
const path = require("path");
var hbs = require("nodemailer-express-handlebars");



let transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "haseebtanveer456@gmail.com",
    pass: "sfserhphcjrzwdbc",
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
  console.log("Join Event Email----------------", data)
  let QRdata = 
{
    accountId:data?.accountId,
    eventId:data?.eventId,
  };
  
  let strJson = JSON.stringify(QRdata);
const config = {type:'terminal'};

// Display QR code to terminal
QRCode.toString(strJson, config, function(err, code)
{
    if(err) return console.log("error occurred");
    console.log(code);
});
  


// Generate the QR code in memory (no need to save it to disk)
QRCode.toDataURL(strJson,config, {
  // color: {
  //   dark: '#',  // Blue dots
  //   light: '#0000' // Transparent background
  // }
}, function (err, qrDataURL) {
  if (err) {
    console.error('Error generating QR code: ' + err);
  } else {
    // Email content
    const mailOptions = {
      from: "haseebtanveer456@gmail.com", // Sender address
      to: data?.to, // List of recipients
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
        {
          filename: 'qrcode.png',
          content: qrDataURL.split(',')[1], // Extract the base64 data from the data URL
          encoding: 'base64',
        },
      ],
    };

    // Send the email with the QR code image
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email: ' + error);
      } else {
        console.log('Email sent: ' + info.response);
        console.log( qrDataURL)
      }
    });
  }
});








//   const config = { type: 'terminal' };

//   // Display QR code to terminal
//   qr.toString(strJson, config, function(err, code)
// {
//     if(err) return console.log("error occurred");
//     console.log(code);
//   });
  


  //   qr.toFile(strJson, 'Some text', {
  //   color: {
  //     dark: '#00F',  // Blue dots
  //     light: '#0000' // Transparent background
  //   }
  // }, function (err,strJson) {
  //   if (err) throw err
  //   console.log('done')
  //   console.log(strJson)
  // })




  // const mailOptions = {
  //   from: "haseebtanveer456@gmail.com", // Sender address
  //   to: data?.to, // List of recipients
  //   subject: data?.subject, // Subject line
  //   template: "join-event-email",
  //   context: {
  //     title: data?.title,
  //     text: data?.text,
  //     link: data?.link,
  //     buttonText: data?.buttonText,
  //   },
  //   attachments: [
  //     {
  //       filename: "Eventsrack-black.png",
  //       path: __dirname + "/images/Eventsrack-black.png",
  //       cid: "myImg",
  //     },
      
  //   ],
  // };

  // transport.sendMail(mailOptions, function (err, info) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(info);
  //   }
  // });
};

module.exports = { generateAndSendEmail };
