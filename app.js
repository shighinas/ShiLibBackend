const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');

var app = express();
const port = process.env.PORT || 4000

const mongoose = require('mongoose');
// connecting to the database
mongoose.connect('mongodb+srv://userone:userone@shilib2.dlg5n.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify: false });

const signupdata = require('./src/model/userdata')

const booksrouter = require('./src/routes/bookroutes')();
const authorsrouter = require('./src/routes/authoroutes')();

app.use(cors());
app.use(bodyparser.json());
app.use('/books', booksrouter);
app.use('/authors', authorsrouter);

adminData = {email: 'admin@admin.com', password: '12345'};


// sign In validation
app.post('/login', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
    userdata = {email : req.body.email, password : req.body.password}
    if(userdata.email==adminData.email && userdata.password==adminData.password){
        let payload = {subject: adminData.email+adminData.password};
        let token = jwt.sign(payload, 'adminAccess');
        res.status(200).send({'token': token, 'role':'admin'});
    }
    else{
        signupdata.findOne(userdata, (err, user)=>{
            if(err){
                console.log(err);
                res.status(500).send('server error');
            }
            if(!user){
                return res.status(401).send('incorrect');
            }
            else {
                let payload = {subject: user.email+user.password};
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({'token': token, 'role':''});
            }
        });
    }
});
// sign In validation

// sign Up validation
app.post('/reguser', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
    var item = {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password : req.body.password
    }
    signupdata.findOne({email: item.email}, (err, user)=>{
        if(err){
            console.log("error during signUp server side validation"+ err);
        }
        if(!user){
            var user = signupdata(item);
            user.save();
            res.status(200).send('success')
        }
        else{
            res.status(401).send('User already exists with the same email. Please login or try using another email.');
        }
    })
});
// sign Up validation

app.listen(port, (err)=>{
    if(!err){console.log("Server listening at port", port)}
 });