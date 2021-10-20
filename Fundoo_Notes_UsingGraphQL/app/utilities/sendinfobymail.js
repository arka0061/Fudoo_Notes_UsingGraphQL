/**************************************************************************************************************
 * @description   : It is used to handle mail operations(forgetpassword and resetpassword api).
 * @package       : nodemailer
 * @file          : app/utilities/sendinfobymail.js
 * @author        : Arka Parui
*****************************************************************************************************************/
const nodemailer = require('nodemailer');
const userModel = require('../models/user.model');
const mailModel = require('../models/mail.model');
class sendinfobymail {

    /**
      * @description Used to send code to client mailid by fetching data
      * @param {*} details
      * @param {*} callback
      */
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

    /**
      * @description Used to check if the client mailcode matches with the mailcode
      * sent to the mailid of the client
      * @param {*} details
      * @param {*} user
      */
  sendCode = (details, user) => {
    if (details === user[0].tempcode) {
      return 'true'
    }
    return 'false'
  }
}
module.exports = new sendinfobymail()
