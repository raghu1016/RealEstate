import User from '../models/user.model.js'
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const user = (req,res)=>{
    res.json({message:"user controller"})
}

export const updateUser = async (req,res,next)=>{
    if(req.user.id!==req.params.id) return next(errorHandler(401,"you can only update your own account"));
   
    try{
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                avatar: req.body.avatar,
            }
        },{new:true})

        const {password,...rest}=updatedUser._doc;

        res.status(200).json(rest);
    }
    catch(err){
        next(err);
    }
}

export const logout = async (req,res,next)=>{
    try{
        res.clearCookie("access_token").status(200).json("user logout");
    }
    catch(err){
        next(err);
    }
}

export const deleteUser = async(req,res,next)=>{
    console.log(req.user.id,req.params.id)
    if(req.user.id!==req.params.id) return next(errorHandler(401,"you can only delete your own account"));
    try{
        console.log(await User.findById(req.params.id));
        const value = await User.findByIdAndDelete(req.params.id); 
        res.clearCookie('access_token');
        value?res.status(200).json("user deleted successfully"):res.status(200).json('user not found');
    }
    catch(err){
        next(err);
    }

}