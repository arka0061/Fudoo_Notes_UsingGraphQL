const userModel = require('../../models/user.model.js');
const sendinfobymail = require('../../utilities/sendinfobymail.js');
const bcryptPassword = require('../../utilities/bcrpytpassword.js');
module.exports = {
    resetpassword: async args => {
        try {
            const userPresent = await userModel.findOne({ email: args.resetInput.email });
            if (!userPresent) {
                return ({
                    success: false,
                    message: 'User is not registered',
                });
            }
            const checkCode = sendinfobymail.sendCode(args.resetInput.mailcode)
            if (checkCode == "false") {
                return ({
                    success: false,
                    message: 'Invalid Mail Code',
                });

            }
            bcryptPassword.hashpassword(args.resetInput.newpassword, (error, data) => {
                if (data) {
                    userPresent.password = data;
                    userPresent.save();
                }
                else {
                    throw error;
                }
            })
            return ({
                success: true,
                message: 'password changed',
            });

        }
        catch (error) {
            console.log(error)
            return ({
                success: false,
                message: 'Internal Error Occured',
            });
        }
    }
}