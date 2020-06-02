const jwt = require('jsonwebtoken');
const User = require('../models/user')


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

// function authenticateToken(req, res, next) {
//     // Gather the jwt access token from the request header
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401) // if there isn't any token
  
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
//       console.log(err)
//       if (err) return res.sendStatus(403)
//       req.user = user
//       next() // pass the execution off to whatever request the client intended
//     })
//   }