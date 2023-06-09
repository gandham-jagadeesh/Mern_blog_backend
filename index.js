require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const app     = express()
const mongoose = require("mongoose");
const cookieParser   = require('cookie-parser');
const multer  = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/'})
const port    = process.env.PORT;

app.use("/uploads",express.static(__dirname+'/uploads'));
app.use(cors({credentials:true,origin:'https://mern-blog-frontend-seven.vercel.app/'}));
app.use(express.json())
app.use(cookieParser());

mongoose.set('strictQuery', false);
mongoose.connect(process.env.mongo);


app.use("/register",require("./controllers/register"));
app.use("/login",require("./controllers/login"));
app.use("/profile",require("./controllers/profile"));
app.use("/logout",require("./controllers/logout"));
app.use("/post",uploadMiddleware.single('file'),require("./controllers/post"));

app.listen(port,()=>{
    console.log(`${port}`);
})