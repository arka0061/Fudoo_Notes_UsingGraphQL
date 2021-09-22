const createUser = require('./createUser');
const users=require('./getUsers');
const loginUser=require('./loginUsers');
const forgotpassword=require('./forgotpassword');
const resetpassword=require('./resetpassword');
const rootResolver = {
  ...createUser,
  ...loginUser,
  ...users,
  ...forgotpassword,
  ...resetpassword
};
module.exports = rootResolver;