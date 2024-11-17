//password we want to see use the below two methods
const express=require('express')
const router=express.Router()
const User=require('../models/User')
const {body,validationResult}=require('express-validator');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const jwtSecret="My name is DVSESWAR"
router.post("/createuser",[
    body('email').isEmail(),
    body('name').isLength({min:5}),
    body('password','Incorrect Password').isLength({min:5})]
    ,async(req,res)=>{
    /*  console.log(req.body.name, //for debug
         req.body.password,
         req.body.email,
         req.body.location
      )*/

       const errors=validationResult(req);  //helps in checking that passwaord and name length is 5 or not
       if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
       }

   const salt=await bcrypt.genSalt(10);
   let secPassword=await bcrypt.hash(req.body.password,salt)//here password convert to encryptrd format we use bcrypt,jsonwebtoken for this
    try{
         await User.create({
               name:req.body.name,
               password:secPassword,
               email:req.body.email,
               location:req.body.location
        }).then(res.json({success:true}))
       }
       catch(error){
        console.log(error)
        res.json({success:false});
       }
})

router.post("/loginuser",[
   body('email').isEmail(),
   body('password','Incorrect Password').isLength({min:5})]
   ,async(req,res)=>{
      

      const errors=validationResult(req);  //helps in checking that passwaord and name length is 5 or not
       if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
       }
      

   let email=req.body.email;
   try{
        let userData= await User.findOne({email});
        if(!userData){
         return res.status(400).json({errors:"Try logging with correct credentials"})
        }
       
         const pwdCompare=await bcrypt.compare(req.body.password,userData.password)
        if(!pwdCompare){
         return res.status(400).json({errors:"Try logging with correct credentials"})
        }

        const data={
         user:{
            id:userData.id
         }
        }
        const authToken=jwt.sign(data,jwtSecret)
        return res.json({success:true,authToken:authToken})//here we generate authorization token
          
      }
      catch(error){
       console.log(error)
       res.json({success:false});
      }
})

module.exports=router;
//structure taken from express-validator 



//2.original password is shown in server after you logged in but the password stored in database is in encrypt format only 
//const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const { body, validationResult } = require('express-validator');
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const jwtSecret = "My name is DVSESWAR";

// router.post("/createuser", [
//     body('email').isEmail(),
//     body('name').isLength({ min: 5 }),
//     body('password', 'Incorrect Password').isLength({ min: 5 })
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Store original password for logging (only for debugging)
//     const originalPassword = req.body.password;

//     const salt = await bcrypt.genSalt(10);
//     let secPassword = await bcrypt.hash(originalPassword, salt); // Hash the password

//     try {
//         await User.create({
//             name: req.body.name,
//             password: secPassword,
//             email: req.body.email,
//             location: req.body.location
//         });
//         console.log("Original Password:", originalPassword); // Log original password for debugging
//         return res.json({ success: true });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false });
//     }
// });

// router.post("/loginuser", [
//     body('email').isEmail(),
//     body('password', 'Incorrect Password').isLength({ min: 5 })
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     let email = req.body.email;
//     try {
//         let userData = await User.findOne({ email });
//         if (!userData) {
//             return res.status(400).json({ errors: "Try logging in with correct credentials" });
//         }

//         const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
//         if (!pwdCompare) {
//             return res.status(400).json({ errors: "Try logging in with correct credentials" });
//         }

//         const data = {
//             user: {
//                 id: userData.id
//             }
//         };
//         const authToken = jwt.sign(data, jwtSecret);
//         return res.json({ success: true, authToken: authToken }); // Generate authorization token
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false });
//     }
// });

// module.exports = router;
// //structure taken from express-validator 


//3.storing original password in the database itself note:it is not recommended  
//const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const { body, validationResult } = require('express-validator');
// const jwt = require("jsonwebtoken");

// const jwtSecret = "My name is DVSESWAR";

// router.post("/createuser", [
//     body('email').isEmail(),
//     body('name').isLength({ min: 5 }),
//     body('password', 'Incorrect Password').isLength({ min: 5 })
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     // Store original password
//     const originalPassword = req.body.password;

//     try {
//         await User.create({
//             name: req.body.name,
//             password: originalPassword, // Store original password (not recommended)
//             email: req.body.email,
//             location: req.body.location
//         });
//         return res.json({ success: true });
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false });
//     }
// });

// router.post("/loginuser", [
//     body('email').isEmail(),
//     body('password', 'Incorrect Password').isLength({ min: 5 })
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     let email = req.body.email;
//     try {
//         let userData = await User.findOne({ email });
//         if (!userData) {
//             return res.status(400).json({ errors: "Try logging in with correct credentials" });
//         }

//         // Check if the password matches
//         if (req.body.password !== userData.password) {
//             return res.status(400).json({ errors: "Try logging in with correct credentials" });
//         }

//         const data = {
//             user: {
//                 id: userData.id
//             }
//         };
//         const authToken = jwt.sign(data, jwtSecret);
//         return res.json({ success: true, authToken: authToken }); // Generate authorization token
//     } catch (error) {
//         console.log(error);
//         res.json({ success: false });
//     }
// });

// module.exports = router;
