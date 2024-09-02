import express from 'express'
import mogoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cors from 'cors';
import cookieParser from "cookie-parser"

//deploy
import path from 'path';



dotenv.config();
const app = express();
app.use(cors());

mogoose.connect(process.env.MONGO).then(()=>{
    console.log("mongo connected");
}).catch((err)=>{
    console.log(err);
});

// app.get("/",(req,res)=>{
//     res.json({message:"Hello world"});
// })

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/listing",listingRouter);

app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message||"Internal server error";
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})

app.listen(3000,()=>{
    console.log("server running on port 3000")
});