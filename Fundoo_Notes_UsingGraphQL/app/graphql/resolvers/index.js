const userResolvers=require('./userResolvers.js');
const rootResolver = { 
  ...userResolvers
}
module.exports = rootResolver;