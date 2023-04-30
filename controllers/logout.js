const express = require("express")
const router  = express.Router();

router.post("/",(req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', 'https://mern-blog-frontend-seven.vercel.app/');

    res.cookie('token','').json("ok");
});

module.exports=router;