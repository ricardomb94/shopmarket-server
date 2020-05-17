
const {check} = require('express-validator')

exports.userSignupValidator = [
    check('name')
        .not()
        .isEmpty()
        // .matches(/.+\@.+\..+/)
        .withMessage('Ce champ est obligatoire'),
    check('email')
        .isEmail()
        .withMessage('Inserez un email valide'),
    check('password')
        .isLength({min: 6})
        .withMessage('Le mot de pass doit contenir au moins 6 caractères')
        // .matches(/\d/)
];

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Inserez un email valide'),
    check('password')
        .isLength({min: 6})
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
];