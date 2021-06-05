var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var ejs = require('express-ejs-layouts');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(express.static('public'));
app.use(ejs);

app.use(require('./routes'));

// Characters routes
var characters = require('./routes/characters');
app.use('/characters', characters);

// Spells routes
var spells = require('./routes/spells');
app.use('/spells', spells);

// Items routes
var items = require('./routes/items');
app.use('/items', items);

// Regions routes
var regions = require('./routes/regions');
app.use('/regions', regions);

// Enemies routes
var enemies = require('./routes/enemies');
app.use('/enemies', enemies);

app.set('port', 65535);
app.set('view engine', 'ejs');

// 404 ERROR
app.use(function(req, res){
    res.status(404);
    res.render('404.ejs');
})

// 500 ERROR
app.use(function(req, res, next){
    console.error(req.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500.ejs');
});

// APP LISTEN
app.listen(app.get('port'), function(){

    console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');

});