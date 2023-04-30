const express = require("express")
const router  = express.Router();
const jwt    = require("jsonwebtoken");
const secretkey =String(process.env.secret_key);

router.get("/",(req,res)=>{

    const {token} = req.cookies;
    if(token){
    jwt.verify(token,secretkey,{},(err,info)=>{
        if(err){
            throw err;
        }
        res.json(info);
    })}
    else{
        res.json('no token formed');
    }

});

module.exports=router;