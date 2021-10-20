/**
 * @description   : Routes all resolvers in a single file
 * @file          : index.js
 * @author        : Arka Parui
*/
module.exports = [
  // eslint-disable-next-line no-multi-assign
  userResolvers = require('./userResolvers'),
  noteResolvers=require('./noteResolvers'),
  labelResolvers=require('./labelResolver')];
