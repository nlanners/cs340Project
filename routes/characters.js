var express = require('express');
var router = express.Router();
var mysql = require('../public/js/sqlPool.js');
var functions = require('../functions.js');
router.use(express.static('public'));

// CHARACTERS
router.get('/', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT C.*, R.name as regionName FROM Characters C LEFT JOIN Regions R ON C.regionID = R.regionID', function(err, rows, fields){
        functions.errorCheck(err, next);
        context.table = rows;
        res.render('characters.ejs', context);
    });
});

router.post('/', function(req, res, next) {
    var context = {};
    var search = '%' + req.body.search + '%';
    mysql.pool.query('SELECT C.*, R.name as regionName FROM Characters C LEFT JOIN Regions R ON C.regionID = R.regionID WHERE C.name LIKE ?', [search], function(err, rows, fields) {
        functions.errorCheck(err, next);
        context.table = rows;
        context.search = req.body;
        res.render('characters.ejs', context);
    });
});

// ADD/REMOVE CHARCTERS
router.get('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    functions.charDrops(res, next, context);
});

router.post('/addRemoveCharacters', function(req, res, next) {
    var context = {result: null};
    var sql;
    var data;

    // add character
    if (req.query.action === 'add') {
        if (!req.body.name.trim().length) {
            context.result = 'Character not added. Please enter a name.'
            functions.charDrops(res, next, context);
        } else {
            var regionID = req.body.regionID;
            sql = 'INSERT INTO Characters (name, health, enemiesKilled, magic, strength, money, regionID) VALUES (?,?,?,?,?,?,?)';
            data = [req.body.name, req.body.health, req.body.enemiesKilled, req.body.magic, req.body.strength, req.body.money, regionID]
            mysql.pool.query(sql, data, function (err, result) {
                functions.errorCheck(err, next);
                context.result = 'Successfully Added ' + req.body.name;
                functions.charDrops(res, next, context);
            });
        }
        // remove character
    } else if (req.query.action === 'delete') {
        sql = 'DELETE FROM Characters WHERE characterID=?';
        data = [req.body.characterID];
        mysql.pool.query(sql, data, function (err, result) {
            functions.errorCheck(err, next);
            if (result.affectedRows === 1) {
                context.result = 'Successfully Deleted Character ' + req.body.characterID
            }
            functions.charDrops(res, next, context);
        });
    }

});

// ALTER CHARACTERS
router.get('/alterCharacters', function(req, res, next) {
    var context = {result: null};
    mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function(err, rows, fields){
        functions.errorCheck(err, next);
        context.characterIDs = rows;
        mysql.pool.query('SELECT regionID, name FROM Regions ORDER BY regionID ASC', function(err, rows, fields){
            functions.errorCheck(err, next);
            context.regionIDs = rows;
            res.render('alterCharacters.ejs', context);
        })
    });
});

router.post('/alterCharacters', function(req, res, next) {
    var context = {result: null};
    if (!req.body.name.trim().length) {
        context.result = 'Character not updated. Please enter a name.'
        mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function (err, rows, fields) {
            functions.errorCheck(err, next);
            context.characterIDs = rows;
            mysql.pool.query('SELECT regionID, name FROM Regions ORDER BY regionID ASC', function (err, rows, fields) {
                functions.errorCheck(err, next);
                context.regionIDs = rows;
                res.render('alterCharacters.ejs', context);
            });
        });
    } else {
        mysql.pool.query('SELECT * FROM Characters WHERE characterID=?', [req.body.characterID], function (err, result) {
            functions.errorCheck(err, next);
            if (result.length === 1) {
                var curVals = result[0];
            }
            var sql = 'UPDATE Characters SET name=?, health=?, enemiesKilled=?, magic=?, strength=?, money=?, regionID=? WHERE characterID=?';
            var data = [req.body.name || curVals.name,
                req.body.health || curVals.health,
                req.body.enemiesKilled || curVals.enemiesKilled,
                req.body.magic || curVals.magic,
                req.body.strength || curVals.strength,
                req.body.money || curVals.money,
                req.body.regionID || curVals.regionID,
                req.body.characterID];
            mysql.pool.query(sql, data, function (err, result) {
                functions.errorCheck(err, next);
                context.result = 'Successfully Updated Character';
                mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function (err, rows, fields) {
                    functions.errorCheck(err, next);
                    context.characterIDs = rows;
                    mysql.pool.query('SELECT regionID, name FROM Regions ORDER BY regionID ASC', function (err, rows, fields) {
                        functions.errorCheck(err, next);
                        context.regionIDs = rows;
                        res.render('alterCharacters.ejs', context);
                    });
                });
            });
        });
    }});

router.post('/alterCharacters/autofill', function(req, res, next) {
    mysql.pool.query('SELECT * FROM Characters WHERE characterID=?', [req.body.charID], function(err, rows, fields) {
        functions.errorCheck(err, next);
        var context = {};
        context.char = rows[0];
        res.send(context);
    });
});

module.exports = router;