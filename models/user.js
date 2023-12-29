const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
    // we are not adding the field of username and password becoz the passport-local-mongoose will automatically added these two
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User' , userSchema);