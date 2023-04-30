const express = require("express");
const cors    = require("cors");
const app     = express()
const mongoose = require("mongoose");
const cookieParser   = require('cookie-parser');
const multer  = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/'})
const dotenv    = require("dotenv").config();
const port    = process.env.port;

app.use("/uploads",express.static(__dirname+'/uploads'));
app.use(cors({credentials:true,origin:"https://mern-blog-frontend-seven.vercel.app/"}));
app.use(express.json())
app.use(cookieParser());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo);



app.use("https://mernblogbackend-production.up.railway.app/register",require("./controllers/register"));
app.use("https://mernblogbackend-production.up.railway.app/login",require("./controllers/login"));
app.use("https://mernblogbackend-production.up.railway.app/profile",require("./controllers/profile"));
app.use("https://mernblogbackend-production.up.railway.app/logout",require("./controllers/logout"));
app.use("https://mernblogbackend-production.up.railway.app/post",uploadMiddleware.single('file'),require("./controllers/post"));

app.listen(port,()=>{
    console.log(`${port}`);
})