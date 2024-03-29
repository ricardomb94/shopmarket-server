const mongoose = require('mongoose')
const crypto = require('crypto')


// user schema
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        requires:true,
        max: 32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        lowercase: true
    },
    about:{
        type:String,
        trim:true
    },
    hashed_password:{
        type:String, 
        trim:true,
    },
    salt:String,
    role:{
        type: String,
        default: 'subscriber'
    },
    resetPasswordLink:{
        data: String,
        default: ''
    },
    history:{
        type: Array,
        default:[]
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
    
},{timestamps: true})

//virtual
userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//methods encryptPassword
userSchema.methods = {
    authenticate: function(plainTex){
        return this.encryptPassword(plainTex) === this.hashed_password;
    },
    
    encryptPassword: function(password){
        if(!password)return '';
        try {
            return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
        } catch(err) {
            return '';
        }
    },
    
    makeSalt: function(){
        return Math.round(new Date().valueOf()* Math.random())+'';
    }
};

module.exports = mongoose.model('User', userSchema);