const express = require('express');
const router = express.Router();
const User = require('../../modules/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../Keys');
const passport = require ('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


router.get('/test', (req, res)=> res.json({msg: 'Users works'}));



//@route POST api/users/register
//@desc Register user
//@access Public

router.post('/register', (req, res)=> {
   const {errors, isValid}= validateRegisterInput(req.body);

   //Check for validation
   if(!isValid){
       return res.status(400).json(errors);
   }

    User.findOne({email: req.body.email})
        .then(user => {
            if (user){
                return res.status(400).json({email: 'Email already exists'});
            }
            else{
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                });
                
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                });
            }
        })
})


//@route POST api/users/login
//@desc Login user/return a JWT token
//@access Public

router.post('/login', (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user => {
        //check for the user
        if (!user){
            return res.status(404).json({email: 'User not found'});
        }
        //Check for password
        bcrypt.compare(password, user.password)
        .then(isMatch =>{
            if(isMatch){
                //user matched
                const payload = {id: user.id, name: user.name, avatar: user.avatar};

                //Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: 3600},
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                    );
            } else{
                return res.status(400).json({password: 'Password incorrect'});
            }
        })
    })
})

//@route GET api/users/current
//@desc  Return current user
//@access Private

router.get('/current', passport.authenticate('jwt', {session: false}),
(req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;