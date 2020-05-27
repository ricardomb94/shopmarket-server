const express = require('express');
const router = express.Router();
const verify = require('../controllers/verifyToken')
const validateToken =  require('../helpers/utils').validateToken




//import controller
const {userById} = require('../controllers/user')
const {requireSignin, adminMiddleware} = require('../controllers/auth');
const {read, update} = require('../controllers/user');

//Il faut être connecté pour lire et modifier les info relatives aux utilisateurs authentifiés
router.get("/secret/:userId", requireSignin, (req, res) => {
        res.json({
        user:req.profile
    });
})

router.param('userId', userById)
router.get('/user/:id', requireSignin, read);
router.put('/user/update', requireSignin, update);
router.put('/admin/update', requireSignin, adminMiddleware, update);



module.exports = router;