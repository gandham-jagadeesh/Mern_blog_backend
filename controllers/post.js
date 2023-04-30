const PostModel = require("../models/post");
const express = require("express");
const router  = express.Router();
const fs=require("fs");
const jwt=require("jsonwebtoken");
const secretkey =String(process.env.secret_key);


router.post("/",async  (req,res)=>{

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


router.get("/:id", async (req, res) => {
    const {id} = req.params;
    const postDoc = await PostModel.findById(id).populate('author', ['username']);
    console.log(postDoc);
    res.json(postDoc);
  });


  router.get('/', async (req,res) => {
    res.json(
      await PostModel.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  });
  





router.put("/",async (req,res) => {

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



module.exports=router;