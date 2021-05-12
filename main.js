var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var ejs = require('express-ejs-layouts');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(express.static('public'));
app.use(ejs);


app.set('port', 65535);
app.set('view engine', 'ejs');

app.get('/', function(req, res, next){
    res.render('index.ejs');
});

app.get('/characters', function(req, res, next) {
    res.render('characters.ejs');
})

app.get('/addRemoveCharacters', function(req, res, next) {
    res.render('addRemoveCharacters.ejs')
})

app.get('/alterCharacters', function(req, res, next) {
    res.render('alterCharacters.ejs');
})

app.get('/items', function(req, res, next) {
    res.render('items.ejs');
})

app.get('/addRemoveItems', function(req, res, next) {
    res.render('addRemoveItems.ejs');
})

app.get('/alterItems', function(req, res, next) {
    res.render('alterItems.ejs');
})

app.get('/characterItems', function(req, res, next) {
    res.render('characterItems.ejs');
})

app.get('/spells', function(req, res, next) {
    res.render('spells.ejs');
})

app.get('/addRemoveSpells', function(req, res, next) {
    res.render('addRemoveSpells.ejs');
})

app.get('/alterSpells', function(req, res, next) {
    res.render('alterSpells.ejs');
})

app.get('/enemies', function(req, res, next) {
    res.render('enemies.ejs');
})

app.get('/addRemoveEnemies', function(req, res, next) {
    res.render('addRemoveEnemies.ejs');
})

app.get('/alterEnemies', function(req, res, next) {
    res.render('alterEnemies.ejs');
})

app.get('/regions', function(req, res, next) {
    res.render('regions.ejs');
})

app.get('/addRemoveRegions', function(req, res, next) {
    res.render('addRemoveRegions.ejs');
})

app.get('/alterRegions', function(req, res, next) {
    res.render('alterRegions.ejs');
})

app.get('/regionEnemies', function (req, res, next) {
    res.render('RegionEnemies.ejs');
})

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});