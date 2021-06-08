var express = require('express');
var router = express.Router();
var mysql = require('../public/js/sqlPool.js');
router.use(express.static('public'));

// REGIONS
router.get('/', function(req, res, next) {
    let regionData = {}
    // ACTION HANDLER FOR VIEWING ALL
    mysql.pool.query('SELECT * FROM Regions', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        regionData.results = rows;
        res.render('regions.ejs', regionData);
    });
})

router.post('/', function(req, res, next) {
    let regionData = {}
    // ACTION HANDLER FOR FILTERING
    let filterQuery = 'SELECT * FROM Regions WHERE name LIKE ' + "'%" + req.body.name + "%'"
    mysql.pool.query(filterQuery, function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        regionData.results = rows;
        res.render('regions.ejs', regionData);
    });
})

router.get('/addRemoveRegions', function(req, res, next) {
    let regionData = {}
    // POPULATING DROP DOWN ID MENU
    mysql.pool.query('SELECT regionID, name FROM Regions', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        regionData.regionIDs = rows;
        res.render('addRemoveRegions.ejs', regionData);
    });
})

router.post('/addRemoveRegions', function(req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        if (!req.body.name.trim().length) {
            console.log('Region not created. Please enter a name.')
        } else {
            mysql.pool.query("INSERT INTO Regions (name) VALUES (?)", [req.body["name"]], function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
        // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        mysql.pool.query("DELETE FROM Regions WHERE regionID = ?", [req.body["id"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        })
    }
    // POPULATING DROP DOWN ID MENU
    let regionData = {}
    mysql.pool.query('SELECT regionID, name FROM Regions', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        regionData.regionIDs = rows;
        res.render('addRemoveRegions.ejs', regionData)
    });
})

router.get('/alterRegions', function(req, res, next) {
    if (req.query.id) {
        // AUTO POPULATING UPDATE FORMS BASED ON ID
        let context = {}
        mysql.pool.query("SELECT * FROM Regions WHERE regionID=?", [req.query.id], function(err, result){
            if(err){
                console.log(err);
                return;
            }
            context.result = result;
            res.send(JSON.stringify(context))
        })
    } else {
        let regionData = {}
        // POPULATING DROP DOWN ID MENU
        mysql.pool.query('SELECT regionID, name FROM Regions', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            regionData.regionIDs = rows;
            res.render('alterRegions.ejs', regionData);
        });
    }
})

router.post('/alterRegions', function(req, res, next) {
    let regionData = {}
    // UPDATING ROW
    if (!req.body.name.trim().length) {
        console.log('Region not updated. Please enter a name.');
        mysql.pool.query('SELECT regionID, name FROM Regions', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            regionData.regionIDs = rows;
            res.render('alterRegions.ejs', regionData);
        });
    } else {
        mysql.pool.query("UPDATE Regions SET name=? WHERE regionID=? ", [req.body['name'], req.body['id']], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            // POPULATING DROP DOWN ID MENU
            mysql.pool.query('SELECT regionID, name FROM Regions', function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                regionData.regionIDs = rows;
                res.render('alterRegions.ejs', regionData);
            });
        });
    }
})



module.exports = router;