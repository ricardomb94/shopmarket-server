const formidable = require ('formidable');
// @ts-ignore
const _ = require('lodash');
const fs = require('fs');
const Product = require("../models/product");
const {errorHandler} = require ('../helpers/errorHandler');


exports.productById = (req,res, next, id) =>{
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({
                error: "Le produit que vous demadez n\'existe pas "
            })
        }
        //On assignes la valeur du produit trouvé(dans la base de données/id) à l'objet request
        req.product = product;
        next();
    });
};
// => ProductRoutes. Créer une nouvelle route

exports.read = (req, res) => {
    //Pour optimiser la quête on évite d'uploader l'image(undefined)
    req.product.image = undefined
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'Le téléchargement de l\'image a échoué'
                // err: errorHandler(err)
            });
        };

        //Vérifier que tous les champs(fields) sont remplis
        const {name, description, price, category, quantity, shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: 'Tous les champs sont obligatoires'
            });
        }

        //Si toutes les conditions sont remplies, on peu créer le produit
        let product = new Product(fields);

        // 1kb = 1000
        //1mb = 1.000.000

        if(files.image){
             //Limitation de la taille des images en fonction du poids
             if(files.image.size > 1000000){
                return res.status(400).json({
                    error: 'L\'image doit avoir un poids inférieur à 1mb'
                });
             }
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    // error: 'Quelque chose a mal fonctionné'
                    error: errorHandler(err)
                })
            }
            res.json(result);
        });
    });
};

//Rappeler le produit grâce à l'objet request
exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            // deletedProduct,
            "message": 'Produit supprimé avec succès'
        })
    })
}

//Update
exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: 'Le téléchargement de l\'image a échoué'
                // err: errorHandler(err)
            });
        };

        //Vérifier que tous les champs(fields) sont remplis
        const {name, description, price, category, quantity, shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: 'Tous les champs sont obligatoires'
            });
        }

        //Si toutes les conditions sont remplies, on peu créer le produit
        let product = req.product;
        product = _.extend(product, fields)

        // 1kb = 1000
        //1mb = 1.000.000

        if(files.image){
            // console.log('FILE IMAGE:',files.image);

             //Limitation de la taille des images en fonction du poids
             if(files.image.size > 1000000){
                return res.status(400).json({
                    error: 'L\'image doit avoir un poids inférieur à 1mb'
                });
             }

            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    // error: 'Quelque chose a mal fonctionné'
                    error: errorHandler(err)
                })
            }
            res.json(result);
        });
    });
};


 /**
 * Affichage des produits
 *by sell=/products?sortBy=sold&order=desc&limit=4
 *by sell=/products?sortBy=createdAt&order=desc&limit=4
 *S'il n' y a aucun paramètre précisé, alors tous les produits     seront retournés
 
 */
 exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6
    
    Product.find()
        .select("-image")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products)=>{
            if(err){
                return res.status(400).json({
                    error: "Produits non trouvés"
                });       
                
            }
            res.send(products)
        });
 }
 
 
 /**
 * Afficher les products qui appartiennet à la même catégorie
 */
 exports.listRelated = (req, res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit):6
    
    Product.find({_id:{$ne:req.product}, category: req.product.category})
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error: "Produits non trouvés"
            });       
            
        }
        res.json(products)
    })
 }
 
 exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error: 'Cette catégorie n\'existe pas'
            });
        }
        res.json(categories);
    });
 };
 
 /**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
 

 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-image")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Produits non trouvé"
                });
            }
            res.json({
                size: data.length,//nbre de produit disponibles
                data
            });
        });
};

exports.image = (req, res, next) => {
    if(req.product.image.data){
        res.set('Content-Type', req.product.image.contentType);
        return res.send(req.product.image.data)
    }
    next();
}


exports.listSearch = (req, res) => {
    //Create query object to hold search value and category value
    const query = {}
    //assign search value to query.name
    if(req.query.search){
        query.name = {$regex: req.query.search, $options:'i'}
        //assign category value to query.category
        if(req.query.category && req.query.category !='All'){
            query.category = req.query.category
        }
        //find the product based on query objet with 2 properties
        //search and category
        Product.find(query, (err, products) =>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(products)
        }).select('-image')
    }
}