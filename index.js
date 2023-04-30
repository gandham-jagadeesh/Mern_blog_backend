const express = require("express");
const cors    = require("cors");
const app     = express()
const mongoose = require("mongoose");
const userModel= require("./models/model")
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const cookieParser   = require('cookie-parser');
const multer  = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/'})
const fs  = require('fs');
const PostModel = require("./models/post");
const dotenv    = require("dotenv").config();
const port    = process.env.port
const secretkey =String(process.env.secret_key);
app.use(cors({credentials:true,origin:"http://localhost:3000"}))
app.use(express.json())
app.use(cookieParser());
app.use("/uploads",express.static(__dirname+'/uploads'));
mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo);



app.post("/register",async (req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    const {username,password} = req.body;
    try{
   const hash = bcrypt.hashSync(password, salt);
   const userdoc = await  userModel.create({username:username,password:hash});
   res.json({userdoc});
}
    catch(e){
        res.status(400).json(e);
    }
})


app.post("/login",async(req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
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
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
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

})

app.post("/logout",(req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    res.cookie('token','').json("ok");
})


app.post("/post",uploadMiddleware.single('file'),async  (req,res)=>{
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
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
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
const postsDoc = await PostModel.find().populate('author',['username']).sort({createdAt:-1}).limit(20);
res.json(postsDoc);

})
app.get('/posts/:id', async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    const {id} = req.params;
    const postDoc = await PostModel.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

  app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secretkey, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await PostModel.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('you are not the author');
      }
      await postDoc.update({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });
  
      res.json(postDoc);
    });
  
  });




app.listen(port,()=>{
    console.log("started listening at 4000");
})

module.exports = app;