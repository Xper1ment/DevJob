//require("dotenv").config();
const User = require('../resources/user/user.model');
const jwt = require('jsonwebtoken');
const { check }= require('express-validator');

const newToken = user =>{
    return jwt.sign({id : user._id} , `${process.env.ACCESS_TOKEN_SECRET}`,
        { expiresIn : '10d'})
}

const verifyToken = token =>{
    return new Promise(( resolve , reject ) => {
        jwt.verify( token , `${process.env.ACCESS_TOKEN_SECREAT}` , (err , payload) =>{
                if(err) return reject(err);
                resolve(payload)
            })
    })
}

const signUp = async (req , res) =>{
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
    if(user)
        return res.status(400).json({message : 'user with email already exists.'})
    try{
        let doc = await User.create({...req.body});   
        if(!doc) return res.status(400).end()

        const token = await newToken(doc);
        return res.status(200).send({ token , isRecruiter : doc.isRecruiter });
        
    }catch(e){
        console.error(e);
        return res.status(400).end();
    }
}

const signIn = async (req , res) =>{
    const { email , password , isRecruiter } = req.body;
    try{
        console.log(req.body , 1)
        let user = await User.findOne({ email }).exec();
        if(user.isRecruiter === false && isRecruiter === true ){
            return res.status(401).json({ message : 'user not a recruiter'});
        }

        if(!user) 
            return res.status(401).json({ message : 'user not registered'})
        
        const matchPassword = await user.checkPassword(password); 
        console.log(matchPassword)
        
        if(!matchPassword)
            return res.status(401).json({ message : 'password must match'});
        
        const token = await newToken(user);

        return res.status(200).send({ 'token' : token , isRecruiter : user.isRecruiter } );
        
    
    }catch(e){
        console.error(e);
        return res.status(400).end();
    }    
}

const protect = async (req , res , next ) =>{
    const token = req.headers.authorization ;
    console.log(token)
    try{
        const payload = await verifyToken(token);
        const user = await User.findById( payload.id)
        .select('-password')
        .lean()
        .exec()
        //console.log(user)
        req.user = user;
        next();
    }catch(e){
        console.error(e);
        return res.status(203).end();
    }
}
module.exports = {
    signIn,
    signUp,
    protect
}
