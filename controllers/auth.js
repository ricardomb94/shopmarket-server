const User = require('../models/User');
const jwt = require('jsonwebtoken');

//Mailgun
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN_KEY;

 
 exports.signup = (req, res) => {
    //console.log('REQ BODY ON SIGNUP', req.body);
    const {name, email, password} = req.body
    User.findOne({email}).exec((err,user)=> {
        if(user){
            return res.status(400).json({
                error:'Cet email existe déjà'
            });
        }
    
        const token = jwt.sign({name, email, password},
            process.env.JWT_ACCOUNT_ACTIVATION,
            {expiresIn:'10m'});
        
            const mg = mailgun({'apiKey': process.env.MAILGUN_API_KEY, domain:DOMAIN});
            const data = {
                from: process.env.MAILGUN_FROM,
                to: email,
                subject: `Lien d'activation`,
                text: "Testing some Mailgun awesomness!",
                html: `
                    <h2>Clickez sur le lien suivant afin d'activer votre compte</h2>
                    <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                    <hr/>
                    <p>Cet email contient des informations sensible. Veuillez le supprimer si vous en êtes pas le destinataire</p>
                    <p>${process.env.CLIENT_URL}</p>
                `
            }
            mg.messages()
                .send(data)
                .then(sent => {
                    console.log('SIGNUP EMAIL SENT', data)
                    console.log('SIGNUP EMAIL SENT', sent)
                    return res.json({
                        message: `UN email vous été envoyé sur ${email}.Suivez les instructions pour activer votre compte`
                    });
                })
                .catch(err => {
                    console.log('SIGNUP EMAIL SENT ERROR', err)
                    return res.json({
                        message: err.message
                    });
                });
    });
 };
 
 
 