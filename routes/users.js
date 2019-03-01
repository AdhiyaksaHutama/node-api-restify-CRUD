const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../routes/auth');

module.exports = server=>{
    //register user
    server.post('/register',(req,res,next)=>{
        const {email,password}= req.body;

        const user = new User({
            email,
            password
        });
        
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt, async (err,hash)=>{
                //hash pw
                user.password = hash;
                //save user
                try{
                    const newUser = await user.save();
                    res.send(201);
                    next();
                }catch(err){
                    return next(new errors.InternalError(err.message));
                }
            });
        });
       
    });
    //auth user
    server.post('/auth',async (req,res,next)=>{
        const {email,password} = req.body;
        
        try{
            //authenticate user
            const user = await auth.authenticate(email,password);
            console.log(user);
            next();
           
        }catch(err){
            return next(new errors.UnauthorizedError(err));
        }
    });
    server.get('/users',async (req,res,next)=>{
        try{
            const users = await User.find({});
            res.send(users);
            next();
        }catch(err){
            return next(new errors.InvalidContentError(err));
        }
     
    });
   
};
