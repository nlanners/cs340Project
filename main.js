var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var ejs = require('express-ejs-layouts');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(express.static('public'));
app.use(ejs);
var mysql = require('./public/js/sqlPool.js');


app.set('port', 65535);
app.set('view engine', 'ejs');

function errorCheck(err) {
    if(err) {
        next(err);
        return;
    }
}

app.get('/', function(req, res, next){
    res.render('index.ejs');
});

app.get('/characters', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Characters', function(err, rows, fields){
        errorCheck(err);
        context.table = rows;
        res.render('characters.ejs', context);
    });
});

app.post('/characters', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Characters WHERE name=?', [req.body.search], function(err, rows, fields) {
        errorCheck(err);
        context.table = rows;
        context.search = req.body;
        res.render('characters.ejs', context);
    })
});

app.get('/addRemoveCharacters', function(req, res, next) {

    res.render('addRemoveCharacters.ejs', {result: null})
})

app.post('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;
    if (req.query.action === 'add') {
        sql = 'INSERT INTO Characters (name, health, enemiesKilled, magic, strength, money, regionID) VALUES (?,?,?,?,?,?,?)';
        data = [req.body.name, req.body.health, req.body.enemiesKilled, req.body.magic, req.body.strength, req.body.money, req.body.regionID]
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Added ' + req.body.name;
            }
            res.render('addRemoveCharacters.ejs', context);
        });
    } else if (req.query.action === 'delete') {
        sql = 'DELETE FROM Characters WHERE characterID=?';
        data = [req.body.characterID];
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Deleted Character ' + req.body.characterID
            }

            res.render('addRemoveCharacters.ejs', context);
        });
    }
});

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
    var context = {};
    mysql.pool.query('SELECT characterID, name, strength, money FROM Characters', function(err, rows, fields) {
        errorCheck(err);
        context.characters = rows;
        mysql.pool.query('SELECT itemID, name, damage, cost FROM Items', function(err, rows, fields) {
            errorCheck(err);
            context.items = rows;
            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                errorCheck(err);
                context.joined = rows;
                res.render('characterItems.ejs', context);
            });
        });
    });
});

app.post('/characterItems', function(req, res, next) {
    var context = {};
    if (req.query.action === 'charSearch') {
        var sql = 'SELECT characterID, name, strength, money FROM Characters WHERE name=?';
        var data = req.body.charName;
        mysql.pool.query(sql, data, function(err, rows, fields) {
            errorCheck(err);
            context.table = rows;
            res.send(context);
        })
    } else if (req.query.action === 'itemSearch') {
        var sql = 'SELECT itemID, name, damage, cost FROM Items WHERE name=?';
        var data = req.body.itemName;
        mysql.pool.query(sql, data, function(err, rows, fields) {
            errorCheck(err);
            context.table = rows;
            res.send(context);
        });
    }
});

app.get('/spells', function(req, res, next) {
    var context = {}
    mysql.pool.query('SELECT * FROM Spells', function(err, rows, fields){
        errorCheck(err);
        context.table = rows;
        res.render('spells.ejs', context);
    });
})

app.post('/spells', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Spells WHERE name=?', [req.body.search], function(err, rows, fields) {
        errorcheck(err);
        context.table = rows;
        context.search = req.body;
        res.render('spells.ejs', context);
    })
});

app.get('/addRemoveSpells', function(req, res, next) {
    res.render('addRemoveSpells.ejs', {result: null});
})

app.post('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;
    if (req.query.action === 'add') {
        sql = 'INSERT INTO Spells (name, buyCost, upgradeCost, strength, characterID) VALUES (?,?,?,?,?)';
        data = [req.body.name, req.body.buyCost, req.body.upgradeCost, req.body.strength,req.body.characterID];
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Added ' + req.body.name;
            }
            res.render('addRemoveSpells.ejs', context);
        });
    } else if (req.query.action === 'delete') {
        sql = 'DELETE FROM Spells WHERE spellID=?';
        data = [req.body.spellID];
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Deleted Spell ' + req.body.spellID;
            }

            res.render('addRemoveSpells.ejs', context);
        });
    }
});

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

app.use(function(req, res){
    res.status(404);
    res.render('404.ejs');
})

app.use(function(req, res, next){
    console.error(req.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500.ejs');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
