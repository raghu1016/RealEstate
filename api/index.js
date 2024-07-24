import express from 'express'
import mogoose from 'mongoose';
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js";

dotenv.config();
const app = express();

mogoose.connect(process.env.MONGO).then(()=>{
    console.log("mongo connected");
}).catch((err)=>{
    console.log(err);
});

// app.get("/",(req,res)=>{
//     res.json({message:"Hello world"});
// })
app.use(express.json());
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);
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