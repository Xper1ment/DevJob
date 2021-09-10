const App = require('./application.model');
const Job = require('../job/job.model');
const User = require('../user/user.model');

const getApplication = async ( req , res ) =>{
    try{
        
        const app  = await App.findOne({ _id : req.query.id })
                                .lean()
                                .exec();

        if(!app) return res.status(400).json({ error : 'application not found'});

        return res.status(200).json(app); 

    }catch(err){
        console.error(err);
        return res.status(400).end();
    }    
}

const setAppViewStatus = async ( req , res ) => {
    console.log('received')
    try{
        const userAuth = await User.findOne({ _id : req.user._id })
                                    .lean()
                                    .exec();
        console.log('received')
        if(userAuth.isRecruiter){   
             await App.findByIdAndUpdate
                                ({ _id : req.query.id },
                                 { isViewed : "Viewed" }    
                                ).exec();
            
        }
        else 
            return res.status(400).json({ message : "Not Authourized"})
        return res.status(200).end();

    }catch(e){
        console.warn(e);
        return res.status(400).end();
    }
}

const postApplication = async ( req , res) =>{
    try{
        /*const chkUser = await User.findById({_id : req.user._id })
                                   .lean()
                                   .exec();
        console.log(chkUser.email)
        if( chkUser.email !== req.body.email ) return res.status(400).json({ errors : [{ param : "email" , msg : "Email provided wrong or already taken."}]})*/
        const app = await App.create({ ...req.body , isViewed : "Not Viewed" , applied_to : req.query.job_id });
        const updateSeeker = await User.findByIdAndUpdate({ _id : req.user._id },
                                                            { $push : { application_list : app._id }},
                                                            { new : true}
                                                            )
                                                            .lean()
                                                            .exec();
                                                            

        // this will update 'applications' field in job model,
        // which User (Recruiter) can get access from 'job_list' field in user model 

        const updateRecruiter = await Job.findByIdAndUpdate({ _id : req.query.job_id },
                                                            { $push : { applications : app._id , applicants : req.user._id }},
                                                            { new : true})
                                                            .lean()
                                                            .exec();
                                            

        return res.status(200).json({ message : 'Applied'});

    }catch(err){
        console.error(err);
        return res.status(400).end();
    }
}

const deleteApplication = async ( req , res ) =>{
    const userAuth = await User.findById({ _id : req.user._id }).exec();
    const app = await App.findById({ _id : req.query.id})
                        .lean()
                        .exec();
    try{
        if(!userAuth.isRecruiter){
            await User.findByIdAndUpdate({ _id : req.user._id },
                                { $pull : { applicantion_list : req.query.id }})
                                .exec();
            await Job.findByIdAndUpdate({ _id : app.applied_to },
            { $pull : { applicants : req.user._id }})
            .exec();

            await App.deleteOne({ _id : req.query.id });

            return res.status(200).json({ message : 'application removed successfully' });
        }
        await Job.findByIdAndUpdate({ _id : app.applied_to },
            { $pull : { applications : req.query.id , applicants : req.user._id }})
            .exec();
        
        return res.status(200).json({ message : 'application removed successfully' });

    }catch(err){
        console.error(err);
        return res.status(400).end();
    }
}

module.exports = {
    getApplication,
    postApplication,
    deleteApplication,
    setAppViewStatus
}
//"client": "cd ..  && cd Client && npm run start",