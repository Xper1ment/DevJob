//require("dotenv").config();
const express = require('express');
const path = require('path');
const cors  = require('cors');
const bodyParser = require('body-parser');
const  connect =  require( './utils/db' );

const { signIn , signUp , protect } = require('./utils/auth'); 
const { authValidator } = require('./utils/validators')
const userRouter = require('./resources/user/user.router');
const jobRouter = require('./resources/job/job.router');
const applyRouter = require('./resources/application/application.router');
const { getAllJobs , getJobDescription } = require('./resources/job/job.controller');

const app = express();
const port = process.env.PORT||5000;

app.use(express.static(path.join(__dirname, '..','Client','build')));

//app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/findJobs',getAllJobs);
app.get('/job-description',getJobDescription);
app.post('/signUp' ,signUp);
app.post('/signIn' , signIn);
app.use('/api', protect);
app.use('/api/job',jobRouter);
app.use('/api/user',userRouter);
app.use('/api/apply',applyRouter);

app.get('/positions.json', getAllJobs)

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..','Client','build')));
    app.get('*', (req, res) => {
      res.sendfile(path.join(__dirname ,'..','Client','build','index.html'));
    })
  } 


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname ,'..','Client','public','index.html'));
})

const start = async () =>{
    try{
        await connect(); 
        app.listen(port,()=>{
            console.log(`App running at ${port}`);
        })
    } catch (e){
        console.error(e);
    }
}

module.exports = start;
