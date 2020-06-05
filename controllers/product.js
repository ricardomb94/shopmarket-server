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
            console.log('FILE IMAGE:',files.image);
            
             //Limitation de la taille des images en fonction du poids
             if(files.image.size > 1000000){
                return res.status(400).json({
                    error: 'L\'image doit avoir un poids inférieur à 1mb'
                });
             }
            console.log('PRODUCT.IIMAGE.DATA', product.image.data)
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }
        product.save((err, result) => {
        console.log('PRODUCT SAVE', result)
            if(err) {
                return res.status(400).json({
                    // error: 'Quelque chose a mal fonctionné'
                    error: errorHandler(err)
                })
            }
            res.json(result);
            console.log('PROD CONTROLLER', result)
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