const {validationResult} = require('express-validator')

//Validation des données par rapport au check
//en fonction des champs: name, email, password
exports.runValidation = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    next();
}