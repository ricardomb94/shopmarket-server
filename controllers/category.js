const Category = require("../models/category");
const {errorHandler} = require ('../helpers/errorHandler')

exports.categoryById = (req,res, next, id) =>{
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                // error: "La catégorie que vous demadez n\'existe pas "
                error: errorHandler(err)
            })
        }
        //On assignes la valeur de la catégorie trouvée(dans la base de données/id) à l'objet request
        req.category = category;
        next();
    });
};

exports.create = (req, res) => {
    const category = new Category(req.body.category)
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                 error: errorHandler(err)
            });
        }
        res.json({data});
    });
};

exports.read = (req, res) => {
    return res.json(req.category)
};

exports.update = (req, res) => {
//Pour UPDATE il faut au préalable trouver la CATEGORY
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
                // error: "Une erreur s\'est produite"
            });
        }
        //On renvoie la réponse au client au format jsonS
        res.json(data);
    });
};

exports.remove = (req, res) => {
//Pour REMOVE il faut au préalable trouver la CATEGORY
    const category = req.category;
    category.name = req.body.remove
    category.remove((err, deleteCategory) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
                //  error:"Cette catégorie n'existe pas dans notre catalogue"

            });
        }
        res.json({
        //On renvoie un simple message et non les données
            // deleteCategory,
            message: 'category supprimée avec succès'
        });
    });
};

exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if(err){
            return res.status(400).json({
                error: "Ressource non trouvée"
            });
        }
        res.json(data)
    })
}
