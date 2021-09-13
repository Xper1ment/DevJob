const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Job = require('../job/job.model');

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
         type : String,
         required : true 
    },

    isRecruiter : {
         type :Boolean,
         required : true
    },
    designation : {
        type : String,
        required : true
    },

    skills : [{
        type : String ,     
    }],

    YOE : {
        type : String,
    },

    job_list : [
        {
            type : mongoose.SchemaTypes.ObjectId,
            ref : 'job'
        }
    ],
    application_list : [
        {
            type : mongoose.SchemaTypes.ObjectId,
            ref : 'application'            
        }
    ],
})


userSchema.pre('save',function(next){
    if(!this.isModified('password'))
        return next();
    
    bcrypt.hash(this.password , 10 , (err , hash ) => {
        if(err)
            return err;
        this.password = hash;
        next();
    })
})

userSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.password && update.password.length !== 0 ) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(update.password, salt, (err, hash) => {
          this.getUpdate().password = hash;
          next();
        })
      })
    } else {
      next();
    }
  });


userSchema.methods.checkPassword = function(password){
    const passwordHash = this.password;
    return new Promise(( resolve , reject) => {
        bcrypt.compare( password , passwordHash , (err , same) =>{
            if(err)
                return reject(err);
            return resolve(same);
        })
})
}

const User = mongoose.model('user',userSchema);
module.exports = User;