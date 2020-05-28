const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

//Mailgun
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN_KEY;


 // exports.signup = (req, res) => {
 //    const {name, email, password} = req.body
 //    User.findOne({email}).exec((err,user)=> {
 //        if(user){
 //            return res.status(400).json({
 //                error:'Cet email existe déjà'
 //            });
 //        }
 //
 //
 //        const token = jwt.sign({name, email, password},
 //            process.env.JWT_ACCOUNT_ACTIVATION,
 //            {expiresIn:'10m'});
 //
 //            const mg = mailgun({'apiKey': process.env.MAILGUN_API_KEY, domain:DOMAIN});
 //            const data = {
 //                from: process.env.MAILGUN_FROM,
 //                to: email,
 //                subject: `Lien d'activation`,
 //                text: "Testing some Mailgun awesomness!",
 //                html: `
 //                    <h2>Clickez sur le lien suivant afin d'activer votre compte</h2>
 //                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
 //                    <hr/>
 //                    <p>Cet email contient des informations sensible. Veuillez le supprimer si vous en êtes pas le destinataire</p>
 //                    <p>${process.env.CLIENT_URL}</p>
 //                `
 //            }
 //            mg.messages()
 //                .send(data)
 //                .then(sent => {
 //                    return res.json({
 //                        message: `UN email vous été envoyé sur ${email}.Suivez les instructions pour activer votre compte`
 //                    });
 //                })
 //                .catch(err => {
 //                    console.log('SIGNUP EMAIL SENT ERROR', err)
 //                    return res.json({
 //                        message: err.message
 //                    });
 //                });
 //    });
 // };

exports.signup = (req, res) => {
    // console.log('REQ BODY ON SIGNUP', req.body);
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            });
        }
    });
    let newUser = new User({ name, email, password });

    newUser.save((err, success) => {
        if (err) {
            console.log('SIGNUP ERROR', err);
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: 'Signup success! Please signin'
        });
    });
};


 //Pour activer le compte il nous faut le token
 exports.accountActivation = (req, res) => {
    const {token} = req.body
    if(token){
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decode){
        //en cas d'erreur envoyer un msg d'erreur au user
            if(err){
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err)
                return res.status(401).json({
                    err: 'Votre lien est arrivé à expiration. Veuillez recommencer'
                })
            }
            //En absence d'erreur on peut recueillir les infos utilisateurs( donc le nom, l'email et le mot de passe) grâce à la méthode decode() en lui passant le token en paramètre

            const {name, email, password} = jwt.decode(token)


            //On instancie un nouveau user inspiré du model prédéfini/mongoose
            const user = new User({name, email, password})
            console.log('NEW USER', user)

            //Enfin on peut sauvegarder le user dans la base de données
            user.save((err, user)=> {
                if (err){
                    console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err)
                    return res.status(401).json({
                        error:'La sauvegarde n\'a pas fonctionnée. Veuillez vous inscrire à nouveau'
                    });
                }
                return res.json({
                    user,
                    message: 'Vous êtes inscrit avec succès.Vous pouvez vous connecter.'
                });
            });
        });
    }else{
        //Si l'utilisateur tente de se connecter sans token
        //on renvoie un msge d'erreur
        return res.json({
            message: 'Quelque chose à mal fonctionnée. Veuillez recommencer.'
        });
    }
 };

 exports.signin = (req, res) => {
 const { email, password } = req.body;
//  console.log("=>",req.body)
 //On vérifie que l'utilisateur qui se connecte est déja enregistré
    User.findOne({email}).exec((err, user) => {
        if(err ||!user){
            return res.status(400).json({
                error: 'Vous n\'êtes pas encore inscrit. Veuillez créer un compte'
            })
        }
        //Autentifier
        if(!user.authenticate(password)) {
            return res.status(400).json({
                error: 'L\'email et le  mot de passe ne corrrespondent pas '
            });
        }
        //On génère le token et on l'envoie au cliente
        const token = jwt.sign({_id: req.userId}, process.env.JWT_SECRET, {expiresIn:'15d'});
        //On extrait les infos utilisateurs
        const {_id, name, email, role} = user

        return res.json({
            token,
            user: {_id, name, email, role}
        });
    });
 };


 exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            });
        }

        req.profile = user;
        next();
    });
};
