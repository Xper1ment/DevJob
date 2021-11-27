const Job = require('./job.model');
const Controller = require('../../utils/crud');
const fetch = require('node-fetch');
const mongoose = require('mongoose'); 
const User = require('../user/user.model');
const App = require('../application/application.model'); 

const joburl = 'https://www.reed.co.uk/api/1.0';
const authHeader = { authorization : 'Basic YTAxNThiNDgtNmFlYS00YTljLTk0ODYtN2Y4MDY5NjBjYTZkOg=='}

const postJob = async ( req , res ) => {
        try{    
                //const alreayPostedJob = await Job
                const job = await Job.create({created_by : req.user._id , ...req.body});
                const updateUserJobList = await User.findByIdAndUpdate({ _id : req.user._id },
                                        { $push : { job_list : job._id } },
                                        { new : true })
                                        .exec()
                return res.status(200).json({ data : 'Job posted!'});

        }catch(e){
                console.error(e);
                return res.status(400).end();
        }
};

const updateJob = async ( req , res ) => {
        try{
                console.log(req.body);
                const job = await Job.findByIdAndUpdate({ _id : req.query.id }, 
                                                        { $set : req.body } ,
                                                        { upsert : true ,
                                                        runValidators :true },
                                                function(err){
                                                        if(err){
                                                                console.log(err);
                                                                return res.status(400).json({ error : 'error occured'});
                                                        }
                                                        return res.status(200).json({ data : 'Job description updated!'});        
                                                });

        }catch(e){
                console.error(e);
                return res.status(400).end();
        }
};


const getAllJobs = async ( req , res ) =>{
        const { title , full_time, location } = req.query;
        
        try{   
                let doc = null;
                if(title === "" && location === "" ){                     
                        doc = await Job.find({ full_time })
                                        .lean()
                                        .exec();
                }
                else if( location === "" || title === ""){
                        if(title === ""){
                                doc = await Job.find( { $and : [{ full_time } ,
                                                                {location : location.trim()}]
                                                        })
                                                        .lean()
                                                        .exec();    
                        }
                        if(location === ""){
                                doc = await Job.find( { $and : [{ full_time } ,
                                                                {title : title.trim()}]
                                                        })
                                                        .lean()
                                                        .exec();
                        }                                        
                }
                else{
                                doc = await Job.find(
                                                     { $and : [{location : location.trim()},
                                                               {title : title.trim()},
                                                               {full_time}]
                                                     })
                                                     .lean()
                                                     .exec()
                                        
                }
                const url = (full_time)?`${joburl}/search?keywords=${title}&fullTime=true&locationName=${location}`:
                                        `${joburl}/search?keywords=${title}&fullTime=false&locationName=${location}`;  

                const gitJobs = await fetch( url , { method : 'GET' ,headers : authHeader});

                const response = await gitJobs.json();
                const result = await response.results;
                
                return res.status(200).json(  [ ...doc ,...result ] );

        } catch(e){
                console.error(e);
                return res.status(400).end();
        }
}

const getJobDescription = async ( req , res ) => {
        try{
                const id = req.query.id;
                
                if(/[a-zA-Z]/.test(id)){        
                        const data = await Job.findOne({ _id : id })
                                        .exec();                                        
                        return res.status(200).json(data);
                }
                
                const jobdata = await fetch( `${joburl}/jobs/${id}` , { method : 'GET' ,headers : authHeader});
                const result = await jobdata.json();
                return res.status(200).json( result );
                
        }catch(err){
                console.log(err);
                return res.status(401).end();
        } 
    }

const getJobDescriptionWhenSigned = async ( req , res ) => {
        try{
                if(/[a-zA-Z]/.test(req.query.id)){        
                        const data = await Job.findOne({ _id : req.query.id })
                                        .exec();

                        if( data.applicants.includes( mongoose.Types.ObjectId(req.user._id) ))
                                return res.status(200).json({ isApplied : true });

                        return res.status(200).json({ isApplied : false });
                }
                
                return res.status(200).json({ isApplied : false });
                
        }catch(err){
                console.log(err);
                return res.status(401).end();
        } 
}    

const getJobApplicants =  async ( req , res ) =>{
        try{
                const job  = await Job.findOne({ _id : req.query.id})
                                                .populate('applications')
                                                .exec();
                const result = await job.applications;

                return res.status(200).json({ applicants : result });

        }catch(e){
                console.error(e);
                return res.status(400).end();
        }
}

const getCreatedJobs = async ( req , res ) =>{
        try{

                const doc = await User.findOne({ _id : req.user._id })
                                .populate('job_list')
                                .exec();
                return res.status(200).json({ data : doc.job_list});
                
        }catch(e){
                console.error(e);
                return res.status(400).end();
        }
}

//controller to update job_list where seeker have applied

/*const updateAppliedJob = async ( req , res ) =>{
        try{
                const job =  await Job.findByIdAndUpdate({ _id : req.query.id},
                                                { isApplied : req.query.isApplied})
                                                .lean()
                                                .exec();

                const user = await User.findByIdAndUpdate({ _id : req.user._id },
                                                        { $push : { job_list : req.query.id }})
                                                        .lean()
                                                        .exec();
                return res.status(200).end();

        }catch(e){
                return res.status(400).end();
        }
}*/


const deleteJob = async ( req , res ) =>{
        
        const job = await Job.findByIdAndRemove({ _id : req.query.job_id }).exec();
        if(!job) return res.status(400).json({ message : 'Posted job cannot be deleted'});
        try{     
                Promise.all(job.applicants.map(async (id)=>{ 
                                await App.findByIdAndUpdate({ _id : id },
                                                        { isViewed : 'Post Removed!'})
                                                        .exec();
                                })
                ).catch((e)=>
                        {
                          console.log(e);
                          return res.status(400).end(); 
                        })

                await User.findByIdAndUpdate( { _id : req.user._id },
                                        { $pull : { job_list : job._id }})
                                        .exec();                
                
                return res.status(200).json({ message : "Succesfully deleted posted job." })                
        }catch(e){
                console.warn(e);
                return res.status(500).json({message : "Internal Server Error"});
        }
} 

module.exports = {      
                postJob, 
                getAllJobs, 
                getCreatedJobs, 
                getJobDescription,
                getJobDescriptionWhenSigned, 
                updateJob,
                deleteJob,
                getJobApplicants,
                //updateAppliedJob
        };