const mongoose = require('mongoose');

// schema instance
const schema = mongoose.Schema;
// schema definition
const bookSchema = new schema({
    title : String,
    author : String,
    genre: String,
    publisher : String,
    awards : String,
    pic : String,
    review : String
});

// Model Creation
var bookdata = mongoose.model("bookdata", bookSchema);

module.exports = bookdata;