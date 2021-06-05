var express = require('express');
var router = express.Router();
var mysql = require('../public/js/sqlPool.js');
var functions = require('../functions');

// ITEMS
router.get('/', function(req, res, next) {
    let itemData = {}
    // ACTION HANDLER FOR FILTERING
    if (req.query.action == 'filter') {
        let filterQuery = 'SELECT * FROM Items WHERE name LIKE ' + "'%" + req.query.name + "%'"
        mysql.pool.query(filterQuery, function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.results = rows;
            res.render('items.ejs', itemData);
        });
        // ACTION HANDLER FOR VIEWING ALL
    } else {
        mysql.pool.query('SELECT * FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.results = rows;
            res.render('items.ejs', itemData);
        });
    }
})

router.post('/', function(req, res, next) {
    let itemData = {}
    // ACTION HANDLER FOR FILTERING
    let filterQuery = 'SELECT * FROM Items WHERE name LIKE ' + "'%" + req.body.name + "%'"
    mysql.pool.query(filterQuery, function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        itemData.results = rows;
        res.render('items.ejs', itemData);
    });
})

router.get('/addRemoveItems', function(req, res, next) {
    let itemData = {}
    // POPULATING DROP DOWN ID MENU
    mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        itemData.itemIDs = rows;
        res.render('addRemoveItems.ejs', itemData);
    });
})

router.post('/addRemoveItems', function(req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        mysql.pool.query("INSERT INTO Items (name, damage, cost) VALUES (?, ?, ?)", [req.body["name"], req.body["damage"], req.body["cost"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        });
        // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        mysql.pool.query("DELETE FROM Items WHERE itemID = ? ", [req.body["id"]],function(err, result){
            if(err){
                console.log(err);
                return;
            }
        })
    }
    // POPULATING DROP DOWN ID MENU
    let itemData = {}
    mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        itemData.itemIDs = rows;
        res.render('addRemoveItems.ejs', itemData)
    });
})

router.get('/alterItems', function(req, res, next) {
    if (req.query.id) {
        // AUTO POPULATING UPDATE FORMS BASED ON ID
        let context = {}
        mysql.pool.query("SELECT * FROM Items WHERE itemID=?", [req.query.id], function(err, result){
            if(err){
                console.log(err);
                return;
            }
            context.result = result;
            res.send(JSON.stringify(context))
        })
    } else {
        let itemData = {}
        // POPULATING DROP DOWN ID MENU
        mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.itemIDs = rows;
            res.render('alterItems.ejs', itemData);
        });
    }
})

router.post('/alterItems', function(req, res, next) {
    let itemData = {}
    mysql.pool.query("UPDATE Items SET name=?, damage=?, cost=? WHERE itemID=? ", [req.body["name"], req.body["damage"], req.body["cost"], req.body['id']], function(err, result){
        if(err){
            next(err);
            return;
        }
        // POPULATING DROP DOWN ID MENU
        mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.itemIDs = rows;
            res.render('alterItems.ejs', itemData);
        });
    });
})
// CHARACTER ITEMS INTERSECTION TABLE
router.get('/characterItems', function(req, res, next) {
    var context = {};
    // characters table
    mysql.pool.query('SELECT characterID, name, strength, money FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
        functions.errorCheck(err, next);
        context.characters = rows;
        // items table
        mysql.pool.query('SELECT itemID, name, damage, cost FROM Items ORDER BY itemID ASC', function(err, rows, fields) {
            functions.errorCheck(err, next);
            context.items = rows;
            // character and item tables joined
            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                functions.errorCheck(err, next);
                context.joined = rows;
                res.render('characterItems.ejs', context);
            });
        });
    });
});

router.post('/characterItems', function(req, res, next) {
    var context = {};
    // search character table
    if (req.query.action === 'charSearch') {
        var sql = 'SELECT characterID, name, strength, money FROM Characters WHERE name LIKE ?';
        var data = '%' + req.body.charName + '%';
        mysql.pool.query(sql, data, function(err, rows, fields) {
            functions.errorCheck(err, next);
            context.table = rows;
            res.send(context);
        })
        // search item table
    } else if (req.query.action === 'itemSearch') {
        var sql = 'SELECT itemID, name, damage, cost FROM Items WHERE name LIKE ?';
        var data = '%' + req.body.itemName + '%';
        mysql.pool.query(sql, data, function(err, rows, fields) {
            functions.errorCheck(err, next);
            context.table = rows;
            res.send(context);
        });
        // assign item to character
    } else if (req.query.action === 'add') {
        var sql = 'INSERT INTO CharacterItems (characterID, itemID) VALUES (?,?)';
        var data = [req.body.characterID, req.body.itemID];
        mysql.pool.query(sql, data, function(err, result) {
            functions.errorCheck(err, next);
            context.reqStatus = 'Success';
            // update joined table
            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                functions.errorCheck(err, next);
                context.table = rows;
                res.send(context);
            })
        })
        // remove item from character
    } else if (req.query.action === 'delete') {
        var sql = 'DELETE FROM CharacterItems WHERE characterID=? AND itemID=?';
        var data = [req.body.characterID, req.body.itemID];
        mysql.pool.query(sql, data, function(err, result) {
            functions.errorCheck(err, next);
            context.reqStatus = 'Success';
            // update joined table
            mysql.pool.query('SELECT C.characterID, C.name AS charName, I.itemID, I.name AS itemName ' +
                'FROM Characters C ' +
                'JOIN CharacterItems CI ON C.characterID = CI.characterID ' +
                'JOIN Items I ON I.itemID = CI.itemID ' +
                'ORDER BY C.characterID ASC', function(err, rows, fields) {
                functions.errorCheck(err, next);
                context.table = rows;
                res.send(context);
            });
        })
    }
});

module.exports = router;