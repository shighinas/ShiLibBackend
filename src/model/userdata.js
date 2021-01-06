const mongoose = require('mongoose');

const schema = mongoose.Schema;
const signupSchema = new schema({
    name : String,
    email : {type: String, unique:true},
    phone : Number,
    password : String
});

var signupdata = mongoose.model("signupdata", signupSchema);

module.exports = signupdata