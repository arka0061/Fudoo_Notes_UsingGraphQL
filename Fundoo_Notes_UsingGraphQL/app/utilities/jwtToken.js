const jwt = require('jsonwebtoken');
class GetToken {
    getToken = (details) => {
        const token = jwt.sign({
            id: details.id,
            firstName: details.firstName
        }, process.env.JWT_SECRET)
        return token;
    }
}
module.exports=new GetToken();