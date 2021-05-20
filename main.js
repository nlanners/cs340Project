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

function errorCheck(err, next) {
    if(err) {
        next(err);
        return;
    }
}

function getCharsDropdowns(res, next, context) {
    mysql.pool.query('SELECT characterID FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
        errorCheck(err, next);
        context.characterIDs = rows;
        mysql.pool.query('SELECT regionID FROM Regions ORDER BY regionID ASC', function (err, rows, fields) {
            errorCheck(err, next);
            context.regionIDs = rows;
            res.render('addRemoveCharacters.ejs', context);
        });
    });
}

function getSpellsDropdowns(res, next, context) {
    mysql.pool.query('SELECT spellID FROM Spells ORDER BY spellID ASC', function(err, rows, fields) {
        errorCheck(err, next);
        context.spellIDs = rows;
        mysql.pool.query('SELECT characterID FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
            errorCheck(err, next);
            context.characterIDs = rows;
            res.render('addRemoveSpells.ejs', context);
        })
    })
}

app.get('/', function(req, res, next){
    res.render('index.ejs');
});

app.get('/characters', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Characters', function(err, rows, fields){
        errorCheck(err, next);
        context.table = rows;
        res.render('characters.ejs', context);
    });
});

app.post('/characters', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Characters WHERE name=?', [req.body.search], function(err, rows, fields) {
        errorCheck(err, next);
        context.table = rows;
        context.search = req.body;
        res.render('characters.ejs', context);
    });
});

app.get('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    getCharsDropdowns(res, next, context);
});

app.post('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;

    if (req.query.action === 'add') {
        sql = 'INSERT INTO Characters (name, health, enemiesKilled, magic, strength, money, regionID) VALUES (?,?,?,?,?,?,?)';
        data = [req.body.name, req.body.health, req.body.enemiesKilled, req.body.magic, req.body.strength, req.body.money, req.body.regionID]
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Added ' + req.body.name;
            }
            getCharsDropdowns(res, next, context);
        });
    } else if (req.query.action === 'delete') {
        sql = 'DELETE FROM Characters WHERE characterID=?';
        data = [req.body.characterID];
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Deleted Character ' + req.body.characterID
            }
            getCharsDropdowns(res, next, context);
        });
    }

});

app.get('/alterCharacters', function(req, res, next) {
    var context = {result: null};
    mysql.pool.query('SELECT characterID FROM Characters ORDER BY characterID ASC', function(err, rows, fields){
        errorCheck(err, next);
        context.characterIDs = rows;
        res.render('alterCharacters.ejs', context);
    });
});

app.post('/alterCharacters', function(req, res, next) {
    var context = {result: null};
    mysql.pool.query('SELECT * FROM Characters WHERE characterID=?', [req.body.characterID], function(err, result){
        errorCheck(err, next);
        if(result.length === 1){
            var curVals = result[0];
        }
        var sql = 'UPDATE Characters SET name=?, health=?, enemiesKilled=?, magic=?, strength=?, money=? WHERE characterID=?';
        var data = [req.body.name || curVals.name,
                    req.body.health || curVals.health,
                    req.body.enemiesKilled || curVals.enemiesKilled,
                    req.body.magic || curVals.magic,
                    req.body.strength || curVals.strength,
                    req.body.money || curVals.money,
                    req.body.characterID];
        mysql.pool.query(sql, data, function(err, result){
            errorCheck(err, next);
            context.result = 'Successfully Updated Character';
            mysql.pool.query('SELECT characterID FROM Characters ORDER BY characterID ASC', function(err, rows, fields){
                errorCheck(err, next);
                context.characterIDs = rows;
                res.render('alterCharacters.ejs', context);
            });
        });
    });
});

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
        errorCheck(err, next);
        context.characters = rows;
        mysql.pool.query('SELECT itemID, name, damage, cost FROM Items', function(err, rows, fields) {
            errorCheck(err, next);
            context.items = rows;
            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                errorCheck(err, next);
                context.joined = rows;
                mysql.pool.query('SELECT characterID from Characters ORDER BY characterID ASC', function(err, rows, fields) {
                    errorCheck(err, next);
                    context.characterIDs = rows;
                    mysql.pool.query('SELECT itemID from Items ORDER BY itemID ASC', function(err, rows, fields) {
                        errorCheck(err, next);
                        context.itemIDs = rows;
                        res.render('characterItems.ejs', context);
                    });
                });
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
            errorCheck(err, next);
            context.table = rows;
            res.send(context);
        })
    } else if (req.query.action === 'itemSearch') {
        var sql = 'SELECT itemID, name, damage, cost FROM Items WHERE name=?';
        var data = req.body.itemName;
        mysql.pool.query(sql, data, function(err, rows, fields) {
            errorCheck(err, next);
            context.table = rows;
            res.send(context);
        });
    } else if (req.query.action === 'add') {
        var sql = 'INSERT INTO CharacterItems (characterID, itemID) VALUES (?,?)';
        var data = [req.body.characterID, req.body.itemID];
        mysql.pool.query(sql, data, function(err, result) {
            errorCheck(err, next);
            context.reqStatus = 'Success';

            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                errorCheck(err, next);
                context.table = rows;
                res.send(context);
            })
        })
    } else if (req.query.action === 'delete') {
        var sql = 'DELETE FROM CharacterItems WHERE characterID=? AND itemID=?';
        var data = [req.body.characterID, req.body.itemID];
        mysql.pool.query(sql, data, function(err, result) {
            errorCheck(err, next);
            context.reqStatus = 'Success';

            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                errorCheck(err, next);
                context.table = rows;
                res.send(context);
            });
        })
    }
});

app.get('/spells', function(req, res, next) {
    var context = {}
    mysql.pool.query('SELECT * FROM Spells', function(err, rows, fields){
        errorCheck(err, next);
        context.table = rows;
        res.render('spells.ejs', context);
    });
})

app.post('/spells', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM Spells WHERE name=?', [req.body.search], function(err, rows, fields) {
        errorcheck(err, next);
        context.table = rows;
        context.search = req.body;
        res.render('spells.ejs', context);
    })
});

app.get('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    getSpellsDropdowns(res, next, context);
})

app.post('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;
    if (req.query.action === 'add') {
        sql = 'INSERT INTO Spells (name, buyCost, upgradeCost, strength, characterID) VALUES (?,?,?,?,?)';
        data = [req.body.name, req.body.buyCost, req.body.upgradeCost, req.body.strength,req.body.characterID];
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Added ' + req.body.name;
            }
            getSpellsDropdowns(res, next, context);
        });
    } else if (req.query.action === 'delete') {
        sql = 'DELETE FROM Spells WHERE spellID=?';
        data = [req.body.spellID];
        mysql.pool.query(sql, data, function (err, result) {
            errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Deleted Spell ' + req.body.spellID;
            }
            getSpellsDropdowns(res, next, context);
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

    console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

