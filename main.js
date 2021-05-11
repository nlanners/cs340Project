var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(express.static('public'));


app.set('port', 65535);

app.get('/', function(req, res, next){
    res.sendFile('index.html');
});

app.get('/characters', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'characters.html'));
})

app.get('/addRemoveCharacters', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'addRemoveCharacters.html'))
})

app.get('/alterCharacters', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'alterCharacters.html'));
})

app.get('/items', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'items.html'));
})

app.get('/addRemoveItems', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'addRemoveItems.html'));
})

app.get('/alterItems', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'alterItems.html'));
})

app.get('/characterItems', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'characterItems.html'));
})

app.get('/spells', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'spells.html'));
})

app.get('/addRemoveSpells', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'addRemoveSpells.html'));
})

app.get('/alterSpells', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'alterSpells.html'));
})

app.get('/enemies', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'enemies.html'));
})

app.get('/addRemoveEnemies', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'addRemoveEnemies.html'));
})

app.get('/alterEnemies', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'alterEnemies.html'));
})

app.get('/regions', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'regions.html'));
})

app.get('/addRemoveRegions', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'addRemoveRegions.html'));
})

app.get('/alterRegions', function(req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'alterRegions.html'));
})

app.get('/regionEnemies', function (req, res, next) {
    res.sendFile(path.join(__dirname, '/public', 'RegionEnemies.html'))
})

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});