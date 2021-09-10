const { Router } = require('express');
const { postJobValidator } = require('../../utils/validators')
const { postJob , 
        updateJob ,
        deleteJob, 
        getAllJobs , 
        getCreatedJobs , 
        getJobDescription,
        updateAppliedJob,
        getJobApplicants,
        getJobDescriptionWhenSigned } = require('./job.controller');

const router = Router('/'); 

// '/api/job'

router
    .route('/recruiter')
    .get(getCreatedJobs)
    .post( postJobValidator , postJob)
    .put( postJobValidator , updateJob)
    .delete(deleteJob)
router
    .route('/applicants')
    .get(getJobApplicants)
    
router
    .route('/seeker')
    .get(getCreatedJobs)
    //.put(updateAppliedJob)

router
    .route('/isApplied')
    .get(getJobDescriptionWhenSigned)

module.exports = router;