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

// check sql query errors
function errorCheck(err, next) {
    if(err) {
        next(err);
        return;
    }
}

// queries to create FK dropdowns in addRemoveCharacters
function getCharsDropdowns(res, next, context) {
    // characterID dropdown
    mysql.pool.query('SELECT characterID FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
        errorCheck(err, next);
        context.characterIDs = rows;
        // regionID dropdown
        mysql.pool.query('SELECT regionID FROM Regions ORDER BY regionID ASC', function (err, rows, fields) {
            errorCheck(err, next);
            context.regionIDs = rows;
            res.render('addRemoveCharacters.ejs', context);
        });
    });
}

// queries to create FK dropdowns in addRemoveSpells
function getSpellsDropdowns(res, next, context) {
    // spellID dropdown
    mysql.pool.query('SELECT spellID FROM Spells ORDER BY spellID ASC', function(err, rows, fields) {
        errorCheck(err, next);
        context.spellIDs = rows;
        // characterID dropdown
        mysql.pool.query('SELECT characterID FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
            errorCheck(err, next);
            context.characterIDs = rows;
            res.render('addRemoveSpells.ejs', context);
        })
    })
}

// INDEX
app.get('/', function(req, res, next){
    res.render('index.ejs');
});

// CHARACTERS
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
    })
});

// ADD/REMOVE CHARCTERS
app.get('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    getCharsDropdowns(res, next, context);
});

app.post('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;

    // add character
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
    // remove character
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

// ALTER CHARACTERS
app.get('/alterCharacters', function(req, res, next) {
    res.render('alterCharacters.ejs');
})

// ITEMS
app.get('/items', function(req, res, next) {
    res.render('items.ejs');
})

// ADD/REMOVE ITEMS
app.get('/addRemoveItems', function(req, res, next) {
    res.render('addRemoveItems.ejs');
})

// ALTER ITEMS
app.get('/alterItems', function(req, res, next) {
    res.render('alterItems.ejs');
})

// CHARACTER ITEMS INTERSECTION TABLE
app.get('/characterItems', function(req, res, next) {
    var context = {};
    // characters table
    mysql.pool.query('SELECT characterID, name, strength, money FROM Characters', function(err, rows, fields) {
        errorCheck(err, next);
        context.characters = rows;
        // items table
        mysql.pool.query('SELECT itemID, name, damage, cost FROM Items', function(err, rows, fields) {
            errorCheck(err, next);
            context.items = rows;
            // character and item tables joined
            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                errorCheck(err, next);
                context.joined = rows;
                // characterID dropdown
                mysql.pool.query('SELECT characterID from Characters ORDER BY characterID ASC', function(err, rows, fields) {
                    errorCheck(err, next);
                    context.characterIDs = rows;
                    // itemID dropdown
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
    // search character table
    if (req.query.action === 'charSearch') {
        var sql = 'SELECT characterID, name, strength, money FROM Characters WHERE name=?';
        var data = req.body.charName;
        mysql.pool.query(sql, data, function(err, rows, fields) {
            errorCheck(err, next);
            context.table = rows;
            res.send(context);
        })
    // search item table
    } else if (req.query.action === 'itemSearch') {
        var sql = 'SELECT itemID, name, damage, cost FROM Items WHERE name=?';
        var data = req.body.itemName;
        mysql.pool.query(sql, data, function(err, rows, fields) {
            errorCheck(err, next);
            context.table = rows;
            res.send(context);
        });
    // assign item to character
    } else if (req.query.action === 'add') {
        var sql = 'INSERT INTO CharacterItems (characterID, itemID) VALUES (?,?)';
        var data = [req.body.characterID, req.body.itemID];
        mysql.pool.query(sql, data, function(err, result) {
            errorCheck(err, next);
            context.reqStatus = 'Success';
            // update joined table
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
    // remove item from character
    } else if (req.query.action === 'delete') {
        var sql = 'DELETE FROM CharacterItems WHERE characterID=? AND itemID=?';
        var data = [req.body.characterID, req.body.itemID];
        mysql.pool.query(sql, data, function(err, result) {
            errorCheck(err, next);
            context.reqStatus = 'Success';
            // update joined table
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

// SPELLS
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

// ADD/REMOVE SPELLS
app.get('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    getSpellsDropdowns(res, next, context);
})

app.post('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;
    // add spell
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
    // delete spell
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

// ALTER SPELLS
app.get('/alterSpells', function(req, res, next) {
    res.render('alterSpells.ejs');
})

// ENEMIES
app.get('/enemies', function(req, res, next) {
    res.render('enemies.ejs');
})

// ADD/REMOVE ENEMIES
app.get('/addRemoveEnemies', function(req, res, next) {
    res.render('addRemoveEnemies.ejs');
})

// ALTER ENEMIES
app.get('/alterEnemies', function(req, res, next) {
    res.render('alterEnemies.ejs');
})

// REGIONS
app.get('/regions', function(req, res, next) {
    res.render('regions.ejs');
})

// ADD/REMOVE REGIONS
app.get('/addRemoveRegions', function(req, res, next) {
    res.render('addRemoveRegions.ejs');
})

// ALTER REGIONS
app.get('/alterRegions', function(req, res, next) {
    res.render('alterRegions.ejs');
})

// REGION ENEMIES INTERSECTION TABLE
app.get('/regionEnemies', function (req, res, next) {
    res.render('RegionEnemies.ejs');
})

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

