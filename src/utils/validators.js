const { check , body , validationResult } = require('express-validator');

let postAppValidator = [
    check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Following  is required'),
    
    check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Following  is required')
    .isEmail()
    .withMessage('Email is Invalid')
    .trim()
    .escape().normalizeEmail(),

    check('YOE')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Following field is required'),

    ( req , res , next ) =>{
        console.log(req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
]
let postJobValidator = [

    body('title').trim().not().isEmpty()
    .withMessage('Title  is Required'),

    body('company').trim().not().isEmpty()
    .withMessage('Company name  is Required'),

    body('location').trim().not().isEmpty()
    .withMessage('Location  is Required'),

    body('url').trim().not().isEmpty()
    .withMessage('Job Url  is Required'),

    body('company_url').trim().not().isEmpty()
    .withMessage('Company url  is Required'),

    ( req , res , next ) =>{
        console.log(req.body , 2);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        next();
    }
]

let authValidator = [
    postAppValidator[0], //name
    postAppValidator[1], //email    
    postAppValidator[2], // error function
    ( req , res , next ) =>{
        console.log(req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
    next();
    }
    
]

module.exports = {
    postAppValidator,
    postJobValidator,
    authValidator
}