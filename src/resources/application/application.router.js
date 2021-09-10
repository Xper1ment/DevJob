const { Router } = require('express');
const { postAppValidator } = require('../../utils/validators');
const { getApplication ,
        postApplication,
        deleteApplication,
        setAppViewStatus } = require('./application.controller');

const router = Router();

// '/api/apply

router
    .route('/')
    .get(getApplication)
    .post(postAppValidator , postApplication)
    .delete(deleteApplication);

router
    .route('/setViewStatus')
    .get(setAppViewStatus)

module.exports = router;