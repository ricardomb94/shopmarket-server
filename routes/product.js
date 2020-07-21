const express = require("express");
const router = express.Router();


const { create, productById, read, remove, update, list, listRelated, listCategories, listBySearch, image, listSearch } = require("../controllers/product");
const {requireSignin, adminMiddleware} = require('../controllers/auth');
const {userById} = require('../controllers/user')

// const { userById } = require("../controllers/user");

router.get('/product/:productId', read)
router.post('/product/create/:userId', requireSignin, adminMiddleware, create);
router.delete('/product/:productId/:userId', requireSignin, adminMiddleware, remove);
router.put('/product/:productId/:userId', requireSignin, adminMiddleware, update);

router.get('/products', list);
router.get("/products/search", listSearch);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post("/products/by/search", listBySearch);
router.get('/product/image/:productId', image);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
