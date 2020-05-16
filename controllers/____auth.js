const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

//Sendgrid 
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
    const {name, email, password} = req.body;
    
    User.findOne({email}).exec((err, user) => {
        if(user){
            return res.status(400).json({
                error: 'Cet email existe déjà'
            });
        }
        
        const token = jwt.sign({name, email, password}, 
        process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn:'10m'});
        
        const emailData = {
        
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Lien d'activation`,
            html: `
                <h2>Clickez sur le lien que vous avez reçu afin d'activer votre compte</h2>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr/>
                <p>Cet email contient des informations sensible. Veuillez le supprimer si vous en êtes pas le destinataire</p>
                <p>${process.env.CLIENT_URL}</p>
            `  
        }
        sgMail
            .send(emailData)
            .then(sent => {
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