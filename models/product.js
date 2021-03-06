const mongoose = require ("mongoose");
// @ts-ignore
const {ObjectId} = mongoose.Schema




const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:true,
        maxlength: 32
    },
    description:{
        type: String,
        required: true,
        maxlength: 2000
    },
    price:{
        type:Number,
        trim: true,
        required:true,
        maxlength: 32
    },
    quantity:{
        type:Number, 
    },
    sold:{
        type:Number, 
        default:0
    },
    category:{
        type: ObjectId,
        ref: 'Category',
        required:true,
        maxlength: 32
    },
    // sku:{
    //     type: String,
    //     unique:true,
    //     required:true,
    // },
    image: {
        data: Buffer,
        contentType: String  
    },
    shipping: {
        required: false,
        type: Boolean
    }
   
 
}, {timestamps:true})


module.exports = mongoose.model("Product", productSchema);