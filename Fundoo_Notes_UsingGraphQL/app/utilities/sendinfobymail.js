const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
class sendinfobymail {
  getMailDetails = (details, callback) => {
    try {
      let code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
        subject: 'Password Reset FundooNotes',
        text: code
      };

      transporter.sendMail(mailOptions, async function (err, data) {
        if (err) {
          console.log("Error " + err);
          return callback("Error", null);
        } else {
          console.log("Email sent successfully");
          const userPresent = await userModel.findOne({ email: details });
          userPresent.tempCode = code
          await userPresent.save();
          setTimeout(() => {
            console.log("MailCode Expired")
            userPresent.tempCode="expired"
            userPresent.save();
          }, 60000);
          return callback(null, "Email sent successfully")
        }
      });
    }
    catch (error) {
      return callback(error, null)
    }
  }
  sendCode = (details, user) => {
    console.log(user.tempCode)
    if (details === user.tempCode) {
      return 'true'
    }
    if(user.tempCode==='expired')
    {
      return 'expired'
    }
    return 'false'
  }
}
module.exports = new sendinfobymail()
