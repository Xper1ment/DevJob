const { Router } = require('express');
const controllers = require('./user.controller');
const { postAppValidator }= require('../../utils/validators')

const router = Router();
// '/api/user'
router
    .route('/')
    .get(controllers.getOne)
    .post(controllers.createOne)
    .put(postAppValidator,controllers.updateOne)
    .delete(controllers.removeOne);
module.exports = router;
