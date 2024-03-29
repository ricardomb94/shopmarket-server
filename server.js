const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');//Une methode d'Express qui permet de lire les données des inupts de formulaire et les stocke sous forme d'objet Js accessible ds req.body
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
require('dotenv').config();


//Connexion BDD
mongoose
    .connect(process.env.DATABASE,{
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
        })
    .then(() => console.log('BDD connectée'))
    .catch(err => console.log('DB CONNECTION ERROR:', err));


// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

//app middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


//app.use(cors()); // Autorise le partage de ressources entre origines multiples
if((process.env.NODE_ENV = 'development')){
     app.use(cors({origin: `http://localhost:3000`}))
 }
//middleware
app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
// app.use('/', express.static(path.join(__dirname, '/client/build')))

//Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//     //Set static folder name
//     //all the javascript and css files will be read and served from this folder
//     app.use(express.static('client/build'));
//     app.get('*', (req, res) =>{
//         res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));//relative path
//     });
// }

const port = process.env.PORT || 8000; 
app.listen(port, () => {
    console.log(`L'API Shopmarket écoute sur le port ${port}`)
});
