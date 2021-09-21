const userModel = require('../../models/user.model.js');
const bcryptPassword = require('../../utilities/bcrpytpassword.js');
module.exports = {
    createUser: async args => {
        try {
            const usermodel = new userModel({
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
                email: args.userInput.email,
                password: args.userInput.password
            })
            const existingUser = await userModel.findOne({ email: args.userInput.email });
            if (existingUser) {
                return ({
                    success: false,
                    message: 'User already exists',
                });
            }
            bcryptPassword.hashpassword(args.userInput.password, (error, data) => {
                if (data) {
                    usermodel.password = data;
                }
                else{
                    throw error;
                }
                usermodel.save();
                return;
            })
            return ({
                success: true,
                message: 'New User Created',
            });
        }
        catch (error) {
            return ({
                success: false,
                message: 'Internal Error Occured',
            });  
        }
    }
}