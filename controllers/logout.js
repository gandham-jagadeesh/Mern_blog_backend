const express = require("express")
const router  = express.Router();

router.post("/",(req,res)=>{

    res.cookie('token','').json("ok");
});

module.exports=router;