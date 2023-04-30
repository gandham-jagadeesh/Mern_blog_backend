const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const express = require("express")
const router  = express.Router();
const userModel= require("../models/model");

router.post("/",async (req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    const {username,password} = req.body;
    try{
   const hash = bcrypt.hashSync(password, salt);
   const userdoc = await  userModel.create({username:username,password:hash});
   console.log(userdoc);
   res.json({userdoc});
}
    catch(e){
        res.status(400).json(e);
    }
});

module.exports=router;