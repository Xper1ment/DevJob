const getOne = (model) => async ( req ,res ) => {
    try{
     
        let doc = await model.findOne({ _id : req.user._id})
            .populate('job_list')
            .populate('application_list')
            .exec()
        if(!doc) return res.status(400).end();
    
        return res.status(200).json(doc);
        
     }catch(e){
        console.error(e);
        return res.status(400).end();
     }
}

/*const getMany = model => async ( req , res ) => {
     try{
        const doc = await model.find({ created_by : req.user.id })
                            .lean()
                            .exec();
        
        return res.status(200).json({ data : doc });

     } catch(e){
        console.error(e);
        return res.status(400).end();
     }
}
*/
const createOne = model => async (req , res) =>{
    try{
        console.log(req.body , 1 );
        let { isRecruiter , designation } = req.body
        
        if(isRecruiter && designation === "")
            return res.status(400).json({ message : 'Enter your role in company.'})
        
        let doc = await model.create({...req.body});
        return res.status(200).json({ message : 'Signed up successfully.' })
    }catch(e){
        console.error(e);
        return res.status(400).end();
    }
} 

const updateOne = model =>async (req , res) => {
    
    try{
        if(req.body.password.trim().length == 0){
            delete req.body['password'];
        }
        let doc = await model.findOneAndUpdate({ _id : req.user._id },
                                                    req.body,
                                                    { new : true })
                                                    .lean()
                                                    .exec()

    if(!doc) return res.status(400).end();
    return res.status(200).json(doc);

    }catch(e){
        console.error(e);
        return res.status(400).end();
    }
}

const removeOne = model => async (req , res) => {
    try{
       let user =  await model.findOneAndRemove({ _id : req.user._id });
       await App.deleteMany(    { _id : { $in : user.application_list} })
       if(user.isRecruiter)
            await App.deleteMany({ _id : { $in : user.job_list} });
    
       return res.status(200).send(`${model} removed`)
    
    }catch(e){
        console.error(e);
        return res.status(400).end();
    }
}

const crudController = (model) =>({
    removeOne : removeOne(model),
    updateOne : updateOne(model),
    getOne : getOne(model),
    createOne : createOne(model)
})

module.exports = crudController;