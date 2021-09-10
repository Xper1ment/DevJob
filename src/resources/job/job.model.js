const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({    
    title : {
        type : String,
        trim : true,
        required : true
    },
    company :{
        type : String,
        trim : true,
        required : true,
    },
    full_time :{
        type : Boolean,
        required : true
    },
    location : {
        type : String,
        trim : true,
        required : true
    }, 
    description : {
        type : String,
        required : true,
    },
    url : {
        type : String,
        required : true,
    },
    company_url : {
        type : String,
        required : true,
    },
    post_date : {
        type : Date,
    },
    created_by : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'user',
    },

    applications : [{
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'application',
    }],
    
    applicants : [{
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'user'
    }]

})

jobSchema.index({ created_by : 1 , title : 1 , location : 1 } , { unique : true });

const Job = mongoose.model('job',jobSchema);

module.exports = Job;