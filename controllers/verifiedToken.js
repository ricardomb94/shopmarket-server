const jwt = require('jsonwebtoken');
const expressJwt = require('express-Jwt')

module.exports = function auth(req, res, next){
    const token = req.header('authToken');
    if(!token) return res.status(401).send('Access refusé');
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next()
    }catch(err){
        res.status(400).send('Token invalide');
    }
};

// app.use(jwt({
//     secret: process.env.JWT_SECRET,
//     credentialsRequired: false,
//     getToken: function fromHeaderOrQuerystring (req) {
//       if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//           return req.headers.authorization.split(' ')[1];
//       } else if (req.query && req.query.token) {
//         return req.query.token;
//       }
//       return null;
//     }
//   }));
