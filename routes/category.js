const express = require('express');
const router = express.Router();
// const verify = require('../controllers/verifyToken')


const { create, categoryById, read, update, remove, list } = require("../controllers/category");
const {requireSignin, adminMiddleware} = require('../controllers/auth');
const {userById} = require('../controllers/user')

// const { userById } = require("../controllers/user");
router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin, create);
router.put('/category/:categoryId/:userId', requireSignin, adminMiddleware, update);
router.delete('/category/:categoryId/:userId', requireSignin, adminMiddleware, remove);
router.get('/categories', list);


router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;