// const resolvers = {
//   ...userResolvers
// }



// module.exports = resolvers;
module.exports = [
  // eslint-disable-next-line no-multi-assign
  userResolvers = require('./userResolvers'),
  noteResolvers=require('./noteResolvers')];
