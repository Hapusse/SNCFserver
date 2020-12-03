// imports

var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

//var automatedFunctions = require('./automatedFunctions.js');

// Intantiate server

var server = express();

//Body parser configuration

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Methods',"GET,PUT,POST,DELETE,HEAD");
    res.header('Access-Control-Allow-Headers',"*");
    res.header("Access-Control-Allow-Credentials","*");
    res.header("Access-Control-Expose-Headers","*");
    next();
})

// Configure routes

server.get("/", function (req,res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send("<h1> Bienvenue dans la matrice ! </h1>");
});

server.use('/api/',apiRouter);

// Automated functions (runs every minute for now)

//setInterval(automatedFunctions.ratingActualization,INTER_ACTUALISATION_CLASSEMENT);


// Launch server
server.listen(8080, function(){
    console.log("Serveur sur écoute");
});