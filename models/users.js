const moongoose = require('mongoose');

const UserSchema = new moongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: String,
        default: Date.now
    },
    imageUrl:{
        type:String
    }
});
    const User = moongoose.model('User', UserSchema);
    
    module.exports = User;