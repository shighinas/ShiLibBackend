const express = require('express');
const booksrouter = express.Router();
const bookdata = require('../model/bootdata');
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

    booksrouter.get('/', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        bookdata.find()
        .then((books)=> {
            res.send(books);
        });
    })

    booksrouter.get('/:id', function(req, res){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        var id = req.params.id;
        bookdata.findOne({_id : id})
        .then( (book)=> {
            res.send(book);
        });
        
    });

    booksrouter.post('/add', verifyToken, (req, res)=>{
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        console.log(req.body._id);
        var item = {
            title : req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            publisher: req.body.publisher,
            awards: req.body.awards,
            pic: req.body.pic,
            review: req.body.review
        }
        if(req.body._id == ''){
            var book = bookdata(item);
            book.save();
            res.send('Successfully added into books list');
        }
        else{
            bookdata.findOneAndUpdate({_id: req.body._id}, item, { new: true})
            .then( (book)=>{ 
                console.log('updated book '+ book.title);
        })
        }
    });

    booksrouter.get('/delete/:id', verifyToken, (req, res)=>{
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE');
        const id = req.params.id;
        bookdata.findByIdAndRemove({_id : id}, (err, book)=>{
            if(err){console.log("err")}
            else{res.send('Successfully deleted from books list')}
        })
        .then( (book)=>{
            console.log('deleted book ', book);
        })
    });
    return booksrouter;
}

module.exports = router;