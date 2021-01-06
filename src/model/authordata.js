const mongoose = require('mongoose');

// schema instance
const schema = mongoose.Schema;
// schema definition
const authorSchema = new schema({
    name : String,
    dob : Date,
    work : String,
    awards : String,
    pic : String,
    description : String
});

// Model Creation
var authordata = mongoose.model("authordata", authorSchema);

module.exports = authordata;