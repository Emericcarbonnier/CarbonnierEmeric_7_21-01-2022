// Imports
var express     = require('express');
var bodyParser  = require('body-parser');
var app   = require('./app');

var server = express();

// Body Parser config
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Configure routes
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon super server</h1>');
});

server.use('/api/', app);

// server
server.listen(8080, function() {
    console.log('Server en écoute');
});