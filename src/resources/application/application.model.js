const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({    
    title : {
        type : String,
        trim : true,
        required : true
    },
    company : {
        type : String,
        required : true          
    },
    location : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true      
    },
    email : {
        type : String,
        required : true,
        trim : true
    },
    YOE : {
        type : String,
        required : true, 
    },
    skills : {
        type : [String],
        required : true,    
    },
    isViewed : {
        type : String
    },
    date_applied :{
        type : Date ,
        require : true
    },
    applied_to : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'job'
    } 
    /*del_by_recruiter:{
        type : Boolean    
    },
    del_by_seeker : {
        type : Boolean
    }*/
})



const Application = mongoose.model('application',applicationSchema);

module.exports = Application;