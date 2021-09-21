const bcrypt = require('bcryptjs');
const saltRounds = 10;
class bcryptPassword {
    hashpassword = (details, callback) => {
        try{
        bcrypt.hash(details, saltRounds, function (err, hash) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, hash);
            }
        })
    }
    catch (error) {
        return callback(error,null)
    }
}
}
module.exports = new bcryptPassword();