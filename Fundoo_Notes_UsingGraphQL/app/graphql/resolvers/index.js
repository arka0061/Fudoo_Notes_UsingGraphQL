const createUser = require('./createUser');
const users=require('./getUsers');
const rootResolver = {
  createUser,
  users 
};
module.exports = rootResolver;