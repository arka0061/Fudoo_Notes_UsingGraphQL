const userModel = require('../../models/user.model.js');
const sendinfobymail=require('../../utilities/sendinfobymail.js');
module.exports = {
    forgotpassword: async args => {
        try {       
            const userPresent = await userModel.findOne({ email: args.forgetInput.email });
            if (!userPresent) {
                return ({
                    success: false,
                    message: 'User is not registered',
                });
            }
            sendinfobymail.getMailDetails(userPresent.email, (error, data) => {                                  
                if(!data){
                    return ({
                        success: false,
                        message: 'Failed to send Email',
                    });
                }
            })
            return ({
                success: true,
                message: 'Email Sent',
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