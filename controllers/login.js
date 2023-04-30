const userModel= require("../models/model")
const express = require("express")
const router  = express.Router();
const bcrypt = require('bcrypt');
const jwt    = require("jsonwebtoken");
const secretkey =String(process.env.secret_key);

router.post("/",async(req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    const {username,password} = req.body;
    const userDoc = await userModel.findOne({username});
    if(userDoc !== null){
    
    const passok = bcrypt.compareSync(password,userDoc.password);
    if(passok){
     jwt.sign({username,id:userDoc._id},secretkey,{},(err,token)=>{
       if(err){
           throw err;
       }
       res.cookie('token',token).json({
           id:userDoc._id,
           username:userDoc.username
       });
   });}
   else{
       res.status(400).json('wrong credentails');
   }
        }
    else{
       res.status(400).json('username not found in the databases');
    }
   
   
   })

module.exports=router;