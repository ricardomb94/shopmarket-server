const jwt = require('jsonwebtoken');
const User = require('../models/User')


// module.exports=(req, res, next) => {
//         const token = req.header('authToken');
//         if(!token) return res.status(401).send('Accès refusé. Vous n\'êtes pas authentifié.e');
//         try {
//             const verified = jwt.verify(token,process.env.JWT_SECRET);
//             req.user = verified;
//             next();
//         }catch(err) {
//             res.status(400).send('Token no valide')
//         }
// };   

module.exports = async (req, res, next) => {
    try{
        
        const token = req.header('Authorization')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('DECODED _id', req.decoded._id)
        const user = await User.findOne({_id: token.decoded._id, 'tokens,token': token})
        console.log('DECODED', user)
        
        if(!user){
            throw new Error()
        }
        
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Veillez vous authentifier.'})
    }
};
