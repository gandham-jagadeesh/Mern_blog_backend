const express = require("express");
const cors    = require("cors");
const app     = express()
const port    = 4000;
const mongoose = require("mongoose");
const userModel= require("./models/model")
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secretkey = "fed22286b88db770cbe97f76f77edbdb03c01f6a2654c0b4fac41a70574efde9b494dccf882cac83b2b72f5cb87815c82453577fb4f14e6079e3a98d065fca0fbc76ac1a8be7129f7f0b24ddd127b5485a3ff8750816ec2bca60561fa118b1ee"
const cookieParser   = require('cookie-parser');
const multer  = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs  = require('fs');
const PostModel = require("./models/post");

app.use(cors({credentials:true,origin:"http://localhost:3000"}))
app.use(express.json())
app.use(cookieParser());
app.use("/uploads",express.static(__dirname+'/uploads'));
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://gandhamjagadeesh:pHRagJlC3LpHstEH@blogposts.18qnsix.mongodb.net/?retryWrites=true&w=majority');



app.post("/register",async (req,res)=>{
    const {username,password} = req.body;
    try{
   const hash = bcrypt.hashSync(password, salt);
   const userdoc = await  userModel.create({username,password:hash});
   res.json({userdoc});
}
    catch(e){
        console.log(e);
        res.status(400).json(e);
    }
})



app.post("/login",async(req,res)=>{
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

app.get("/profile",(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,secretkey,{},(err,info)=>{
        if(err){
            throw err;
        }
        res.json(info);
    })

})

app.post("/logout",(req,res)=>{
    res.cookie('token','').json("ok");
})


app.post("/post",uploadMiddleware.single('file'),async  (req,res)=>{
 const {originalname,path} = req.file;
 const parts  = originalname.split(".");
 const ext    = parts[parts.length-1];
 const newpath  = path+"."+ext;
 fs.renameSync(path,newpath);
 const {token} = req.cookies;

 jwt.verify(token,secretkey,{},async (err,info)=>{
    if(err){
        throw err;
    }
    const {title,summary,content} = req.body;
    const postDoc =  await PostModel.create({
        title,
        summary,
        content,
        cover:newpath,
        author:info.id
     });
     res.json(postDoc);
 })

})


app.get("/posts",async (req,res)=>{

const postsDoc = await PostModel.find().populate('author',['username']).sort({createdAt:-1}).limit(20);
res.json(postsDoc);

})




app.listen(port,()=>{
    console.log("started listening at 4000");
})
