const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please Provide your name'],
        maxLength: 50,

    },
    email:{
        type: String,
        required: [true, 'Please Provide your email'],
        validate:{
            validator: validator.isEmail,
            message: 'Please Provide a valid Email',
        },
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Please Provide Password'],
        minlength: 3,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user',

    }

});

UserSchema.pre('save', async function(next) {
    
    if(!this.isModified('password'))return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// user defined function on schemas 
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch; 
};

module.exports = mongoose.model('User', UserSchema);
