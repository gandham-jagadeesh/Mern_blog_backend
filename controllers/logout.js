const express = require("express")
const router  = express.Router();

router.post("/",(req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.cookie('token','').json("ok");
});

module.exports=router;