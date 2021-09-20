const userModel=require('../../models/user.model.js');
module.exports= createUser=(args)=>{
    const usermodel=new userModel({
       firstName:args.userInput.firstName,
       lastName:args.userInput.lastName,
       email:args.userInput.email,
       password:args.userInput.password
   })
   usermodel.save();
   return usermodel;
}