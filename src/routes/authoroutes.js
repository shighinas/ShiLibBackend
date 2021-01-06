const express = require('express');
const authorsrouter = express.Router();
const authordata = require('../model/authordata');
const jwt = require('jsonwebtoken');

function router(){

    function verifyToken(req, res, next){
        if(!req.headers.authorization){
            console.log('req header is not there!')
            return res.status(401).send('Unauthorized request');
        }
        let token = req.headers.authorization.split(' ')[1];
        if(token == null){
            console.log('token is not there!')
            return res.status(401).send('Unauthorised request.');
        }
        console.log('token is '+token);
        let payload = jwt.verify(token, 'adminAccess');
        console.log(payload);
        if(!payload){
            return res.status(401).send('Unauthorised request.');
        }
        req.userId = payload.subject;
        next();
    }

    
    authorsrouter.get('/', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        authordata.find()
        .then((authors)=> {
            res.send(authors);
        });
    });
    authorsrouter.get('/:id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        var id = req.params.id;
        authordata.findOne({_id : id})
        .then( (author)=> {
            res.send(author);
        });
    });

    authorsrouter.post('/add', verifyToken, (req, res)=>{
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        var item = {
            name : req.body.name,
            dob: req.body.dob,
            work: req.body.work,
            awards: req.body.awards,
            pic: req.body.pic,
            description: req.body.description
        }
        if(req.body._id == ''){
            var author = authordata(item);
            author.save();
            res.send('Successfully added into authors list');
        }
        else {
            authordata.findOneAndUpdate({_id: req.body._id}, item, { new: true})
            .then( (author)=>{ 
                res.send('Successfully updated from authors list');
                console.log('updated '+ author.name);
            })
        }
    });

    authorsrouter.get('/delete/:id', verifyToken, (req, res)=>{
        const id = req.params.id;
        authordata.findByIdAndRemove({_id : id}, (err, author)=>{
            if(err){console.log("err")}
            else{
                res.send('Successfully deleted an author from authors list')
            }
        })
        .then( ()=>{
            console.log('deleted an author')
        })
    });
    return authorsrouter;
}


module.exports = router;