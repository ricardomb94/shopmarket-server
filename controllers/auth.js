const User = require("../models/User")

exports.signup = (req, res) => {
    //console.log('REQ BODY ON SIGNUP', req.body);
    const {name, email, password} = req.body
    User.findOne({email}).exec((err,user)=> {
        if(user){
            return res.status(400).json({
                error:'Cet email existe déjà'
            })
        }
    });
    let newUser = new User({name, email, password})
    
    newUser.save((err, succes) => {
        if(err){
            console.log('SIGNUP ERROR', err);
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Inscription validée. Vous pouvez vous connecter'
        })
    })
 }