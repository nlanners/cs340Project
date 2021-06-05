var express = require('express');
var router = express.Router();
var mysql = require('../public/js/sqlPool.js');
var functions = require('../functions')

// SPELLS
router.get('/', function(req, res, next) {
    var context = {}
    mysql.pool.query('SELECT S.*, C.name as characterName FROM Spells S JOIN Characters C ON S.characterID = C.characterID', function(err, rows, fields){
        functions.errorCheck(err, next);
        context.table = rows;
        res.render('spells.ejs', context);
    });
})

router.post('/', function(req, res, next) {
    var context = {};
    var search = '%' + req.body.search +'%';
    mysql.pool.query('SELECT S.*, C.name as characterName FROM Spells S JOIN Characters C ON S.characterID = C.characterID WHERE S.name LIKE ?', [search], function(err, rows, fields) {
        functions.errorCheck(err, next);
        context.table = rows;
        context.search = req.body;
        res.render('spells.ejs', context);
    })
});

// ADD/REMOVE SPELLS
router.get('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    functions.spellDrops(res, next, context);
})

router.post('/addRemoveSpells', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;
    // add spell
    if (req.query.action === 'add') {
        sql = 'INSERT INTO Spells (name, buyCost, upgradeCost, strength, characterID) VALUES (?,?,?,?,?)';
        data = [req.body.name, req.body.buyCost, req.body.upgradeCost, req.body.strength,req.body.characterID];
        mysql.pool.query(sql, data, function (err, result) {
            functions.errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Added ' + req.body.name;
            }
            functions.spellDrops(res, next, context);
        });
        // delete spell
    } else if (req.query.action === 'delete') {
        sql = 'DELETE FROM Spells WHERE spellID=?';
        data = [req.body.spellID];
        mysql.pool.query(sql, data, function (err, result) {
            functions.errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Deleted Spell ' + req.body.spellID;
            }
            functions.spellDrops(res, next, context);
        });
    }
});

// ALTER SPELLS
router.get('/alterSpells', function(req, res, next) {
    var context = {result: null};
    mysql.pool.query('SELECT spellID, name FROM Spells ORDER BY spellID ASC', function(err, rows, fields){
        functions.errorCheck(err, next);
        context.spellIDs = rows;
        mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function(err, rows, fields){
            functions.errorCheck(err, next);
            context.characterIDs = rows;
            res.render('alterSpells.ejs', context);
        });
    });
});

router.post('/alterSpells', function(req, res, next) {
    var context = {result: null};
    mysql.pool.query('SELECT * FROM Spells WHERE spellID=?', [req.body.spellID], function(err, result){
        functions.errorCheck(err, next);
        if (result.length === 1){
            var curVals = result[0];
        }
        var sql = 'UPDATE Spells SET name=?, buyCost=?, upgradeCost=?, strength=?, characterID=? WHERE spellID=?'
        var data = [
            req.body.name || curVals.name,
            req.body.buyCost || curVals.buyCost,
            req.body.upgradeCost || curVals.upgradeCost,
            req.body.strength || curVals.strength,
            req.body.characterID || curVals.characterID,
            req.body.spellID || curVals.spellID
        ]
        mysql.pool.query(sql, data, function(err, result) {
            functions.errorCheck(err, next);
            context.result = 'Successfully Updated Spell';
            mysql.pool.query('SELECT spellID, name FROM Spells ORDER BY spellID ASC', function(err, rows, fields){
                functions.errorCheck(err, next);
                context.spellIDs = rows;
                mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function(err, rows, fields){
                    functions.errorCheck(err, next);
                    context.characterIDs = rows;
                    res.render('alterSpells.ejs', context);
                });
            });
        });
    });
})

router.post('/alterSpells/autofill', function(req, res, next) {
    mysql.pool.query('SELECT * FROM Spells WHERE spellID=?', [req.body.spellID], function(err, rows, fields) {
        functions.errorCheck(err, next);
        var context = {};
        context.spell = rows[0];
        res.send(context);
    });
})


module.exports = router;