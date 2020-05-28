const User = require('../models/user')

exports.userById = (req, res, next, userId) => {
    User.findById(userId).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'Utilisateur non trouvé'
            })
        }
        req.Profile = user;
        console.log('USER = >',user)
        next();
    })
};

exports.read = (req, res) => {
    const userId = req.params.id;
    User.findById(userId).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: 'Utilisateur non trouvé'
            });
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
};

exports.update = (req, res) => {
    console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body)
    const {name, password} = req.body

    User.findOne({_id: req.user._id},(err,user)=> {
        if(err || !user){
            return res.status(400).json({
                error: 'Cet utilisateur n\'existe pas'
            })
        }
        if(!name){
            return res.status(400).json({
                error: 'Le nom est obligatoire'
            });
        }else{
            req.user.name = name
        }
        if(password){
            if(password.length < 6){
                return res.status(400).json({
                    error: 'Le mot de passe doit avoir avoir au moins 6 caractères'
                });
            }else {
                user.password = password;
            }
        }
        user.save((err,updatedUser)=> {
            if(err){
                console.log('USER UPDATE ERROR', err)
                return res.status(400).json({
                    error: 'La mise à jour a échoué'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });

};
