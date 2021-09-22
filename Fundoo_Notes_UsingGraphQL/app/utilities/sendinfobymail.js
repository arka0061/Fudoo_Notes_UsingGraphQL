const nodemailer = require('nodemailer');

var code = null;
class sendinfobymail {
  getMailDetails = (details, callback) => {
    try {
      code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        }, tls: {
          rejectUnauthorized: false
        }

      });
      let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: details,
        subject: 'Nodemailer Project',
        text: code
      };

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error " + err);
          return callback("Error", null);
        } else {
          console.log("Email sent successfully");
          return callback(null, "Email sent successfully")
        }
      });
    }
    catch (error) {
      return callback(error, null)
    }
  }
  sendCode = (details) => {
    if (details == code) {
      return "true"
    }
    return "false"
  }
}
module.exports = new sendinfobymail()
