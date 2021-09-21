const createUser = require('./createUser');
const users=require('./getUsers');
const loginUser=require('./loginUsers');
const rootResolver = {
  ...createUser,
  ...loginUser,
  ...users
};
module.exports = rootResolver;