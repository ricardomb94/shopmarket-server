const express = require("express");
const router = express.Router();

const { create, productById, read, remove, update } = require("../controllers/product");
const {requireSignin, adminMiddleware} = require('../controllers/auth');
const {userById} = require('../controllers/user')

// const { userById } = require("../controllers/user");

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, adminMiddleware, create);
router.delete('/product/:productId/:userId', requireSignin, adminMiddleware, remove);
router.put('/product/:productId/:userId', requireSignin, adminMiddleware, update);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;