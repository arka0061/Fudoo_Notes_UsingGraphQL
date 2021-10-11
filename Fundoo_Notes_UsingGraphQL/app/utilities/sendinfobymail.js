const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
const mailModel = require('../models/mail.model');
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
          const mailmodel = new mailModel({
            mail: userPresent.email,
            tempcode: code
          })
          await mailmodel.save();
          return callback(null, "Email sent successfully")
        }
      });
    }
    catch (error) {
      return callback(error, null)
    }
  }
  sendCode = (details, user) => {
    if (details === user[0].tempcode) {
      return 'true'
    }
    return 'false'
  }
}
module.exports = new sendinfobymail()
