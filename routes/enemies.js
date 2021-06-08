var express = require('express');
var router = express.Router();
var mysql = require('../public/js/sqlPool.js');
router.use(express.static('public'));

// ENEMIES
router.get('/', function(req, res, next) {
    let enemyData = {}
    // ACTION HANDLER FOR VIEWING ALL
    mysql.pool.query("SELECT E.enemyID, E.name AS 'enemyName', E.health, E.strength, E.itemID, E.dropChance, E.money, I.name AS 'itemName' FROM Enemies E LEFT JOIN Items I ON E.itemID = I.itemID", function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        enemyData.results = rows;
        res.render('enemies.ejs', enemyData);
    });
})

router.post('/', function(req, res, next) {
    let enemyData = {}
    // ACTION HANDLER FOR FILTERING
    let filterQuery = "SELECT E.enemyID, E.name AS 'enemyName', E.health, E.strength, E.itemID, E.dropChance, E.money, I.name AS 'itemName' FROM Enemies E LEFT JOIN Items I ON E.itemID = I.itemID WHERE E.name LIKE" + "'%" + req.body.name + "%'"
    mysql.pool.query(filterQuery, function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        enemyData.results = rows;
        res.render('enemies.ejs', enemyData);
    });
})

router.get('/addRemoveEnemies', function(req, res, next) {
    let enemyData = {}
    // POPULATING DROP DOWN ENEMY ID MENU FOR DELETE
    mysql.pool.query('SELECT enemyID, name FROM Enemies', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        enemyData.enemyIDs = rows;
        // POPULATING ITEM ID MENU FOR INSERT
        mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.itemIDs = rows;
            res.render('addRemoveEnemies.ejs', enemyData)
        });
    });
})

router.post('/addRemoveEnemies', function(req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        if (!req.body.name.trim().length) {
            console.log('Enemy not added. Please enter a name.')
        } else {
            let dropChance = null
            let money = null
            if (req.body['dropChance']) {
                dropChance = req.body['dropChance']
            }
            if (req.body['money']) {
                money = req.body['money']
            }
            mysql.pool.query("INSERT INTO Enemies (name, health, strength, itemID, dropChance, money) VALUES (?, ?, ?, ?, ?, ?)", [req.body["name"], req.body["health"], req.body["strength"], req.body["itemID"], dropChance, money], function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
        // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {

        mysql.pool.query("DELETE FROM Enemies WHERE enemyID = ? ", [req.body["id"]],function(err, result){
            if(err){
                console.log(err);
                return;
            }
        })
    }
    // POPULATING DROP DOWN ENEMY ID MENU FOR DELETE
    let enemyData = {}
    mysql.pool.query('SELECT enemyID, name FROM Enemies', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        enemyData.enemyIDs = rows;
        // POPULATING ITEM ID MENU FOR INSERT
        mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.itemIDs = rows;
            res.render('addRemoveEnemies.ejs', enemyData)
        });
    });
})

router.get('/alterEnemies', function(req, res, next) {
    if (req.query.id) {
        // AUTO POPULATING UPDATE FORMS BASED ON ID
        let context = {}
        mysql.pool.query("SELECT * FROM Enemies WHERE enemyID=?", [req.query.id], function(err, result){
            if(err){
                console.log(err);
                return;
            }
            context.result = result;
            if (context.result[0].itemID) {
                mysql.pool.query("SELECT name FROM Items WHERE itemID=?", [context.result[0].itemID], function(err, result){
                    if(err){
                        console.log(err);
                        return;
                    }
                    context.itemName = result[0].name
                    res.send(JSON.stringify(context))
                })
            } else {
                res.send(JSON.stringify(context))
            }
        })
    } else {
        let enemyData = {}
        // POPULATING DROP DOWN ENEMY ID MENU FOR DELETE
        mysql.pool.query('SELECT enemyID, name FROM Enemies', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.enemyIDs = rows;
            // POPULATING ITEM ID MENU FOR INSERT
            mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
                if(err){
                    console.log(err);
                    return;
                }
                enemyData.itemIDs = rows;
                res.render('alterEnemies.ejs', enemyData)
            });
        });
    }
})

router.post('/alterEnemies', function(req, res, next) {
    let enemyData = {}
    // UPDATING ROW
    let dropChance = null
    let money = null
    if (req.body['dropChance']) {
        dropChance = req.body['dropChance']
    }
    if (req.body['money']) {
        money = req.body['money']
    }
    if (!req.body.name.trim().length) {
        console.log('Enemy not updated. Please enter a name.');
        mysql.pool.query('SELECT enemyID, name FROM Enemies', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.enemyIDs = rows;
            // POPULATING ITEM ID MENU FOR INSERT
            mysql.pool.query('SELECT itemID, name FROM Items', function(err, rows, fields){
                if(err){
                    console.log(err);
                    return;
                }
                enemyData.itemIDs = rows;
                res.render('alterEnemies.ejs', enemyData)
            });
        });
    } else {
        mysql.pool.query("UPDATE Enemies SET name=?, health=?, strength=?, itemID=?, dropChance=?, money=? WHERE enemyID=? ", [req.body['name'], req.body["health"], req.body["strength"], req.body["itemID"], dropChance, money, req.body['id']], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            // POPULATING DROP DOWN ENEMY ID MENU FOR DELETE
            mysql.pool.query('SELECT enemyID, name FROM Enemies', function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    return;
                }
                enemyData.enemyIDs = rows;
                // POPULATING ITEM ID MENU FOR INSERT
                mysql.pool.query('SELECT itemID, name FROM Items', function (err, rows, fields) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    enemyData.itemIDs = rows;
                    res.render('alterEnemies.ejs', enemyData)
                });
            });
        });
    }
})

router.get('/regionEnemies', function (req, res, next) {
    let compositeData = {}
    // POPULATING DROP DOWN REGION ID MENU
    mysql.pool.query('SELECT regionID, name FROM Regions', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        compositeData.regionIDs = rows;
        // POPULATING DROP DOWN ENEMY ID MENU
        mysql.pool.query('SELECT enemyID, name FROM Enemies', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            compositeData.enemyIDs = rows;
            // POPULATING ENEMIES
            mysql.pool.query("SELECT E.enemyID, E.name AS 'enemyName', E.health, E.strength, E.itemID, E.dropChance, E.money, I.name AS 'itemName' FROM Enemies E LEFT JOIN Items I ON E.itemID = I.itemID", function(err, rows, fields){
                if(err){
                    console.log(err);
                    return;
                }
                compositeData.enemies = rows;
                // POPULATING REGIONS
                mysql.pool.query('SELECT * FROM Regions', function(err, rows, fields){
                    if(err){
                        console.log(err);
                        return;
                    }
                    compositeData.regions = rows;
                    // POPULATING COMPOSITE TABLE
                    mysql.pool.query("SELECT R.regionID, R.name AS 'regionName', E.enemyID, E.name AS 'enemyName' FROM Regions R JOIN RegionEnemies RE ON R.regionID = RE.regionID JOIN Enemies E ON E.enemyID = RE.enemyID ORDER BY E.enemyID ASC;", function(err, rows, fields){
                        if(err){
                            console.log(err);
                            return;
                        }
                        compositeData.joins = rows;
                        res.render('regionEnemies.ejs', compositeData);
                    })
                })
            })
        })
    })
})

router.post('/regionEnemies', function (req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        mysql.pool.query("INSERT INTO RegionEnemies (enemyID, regionID) VALUES (?, ?)", [req.body["enemyID"], req.body["regionID"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        });
        // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        mysql.pool.query("DELETE FROM RegionEnemies WHERE regionID = ? AND enemyID = ?", [req.body["regionID"], req.body["enemyID"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        })
    } else if (req.query.action =="search") {
        let compositeData = {}
        // POPULATING DROP DOWN REGION ID MENU
        mysql.pool.query('SELECT regionID, name FROM Regions', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            compositeData.regionIDs = rows;
            // POPULATING DROP DOWN ENEMY ID MENU
            mysql.pool.query('SELECT enemyID, name FROM Enemies', function(err, rows, fields){
                if(err){
                    console.log(err);
                    return;
                }
                compositeData.enemyIDs = rows;
                // POPULATING COMPOSITE TABLE
                mysql.pool.query("SELECT R.regionID, R.name AS 'regionName', E.enemyID, E.name AS 'enemyName' FROM Regions R JOIN RegionEnemies RE ON R.regionID = RE.regionID JOIN Enemies E ON E.enemyID = RE.enemyID ORDER BY E.enemyID ASC;", function(err, rows, fields){
                    if(err){
                        console.log(err);
                        return;
                    }
                    compositeData.joins = rows;
                    // FILTERING ENEMIES
                    if (req.query.enemySearch) {
                        // POPULATING FILTERED ENEMIES
                        let filterQuery = "SELECT E.enemyID, E.name AS 'enemyName', E.health, E.strength, E.itemID, E.dropChance, E.money, I.name AS 'itemName' FROM Enemies E LEFT JOIN Items I ON E.itemID = I.itemID WHERE E.name LIKE" + "'%" + req.body.enemyNameSearch + "%'"
                        mysql.pool.query(filterQuery, function(err, rows, fields){
                            if(err){
                                console.log(err);
                                return;
                            }
                            compositeData.enemies = rows;
                            // POPULATING REGIONS
                            mysql.pool.query('SELECT * FROM Regions', function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                compositeData.regions = rows;
                                res.render('regionEnemies.ejs', compositeData);
                            })
                        })
                        // FILTERING REGIONS
                    } else if (req.query.regionSearch) {
                        // POPULATING ENEMIES
                        let filterQuery = "SELECT E.enemyID, E.name AS 'enemyName', E.health, E.strength, E.itemID, E.dropChance, E.money, I.name AS 'itemName' FROM Enemies E LEFT JOIN Items I ON E.itemID = I.itemID"
                        mysql.pool.query(filterQuery, function(err, rows, fields){
                            if(err){
                                console.log(err);
                                return;
                            }
                            compositeData.enemies = rows;
                            // POPULATING FILTERED REGIONS
                            let filterQuery = 'SELECT * FROM Regions WHERE name LIKE ' + "'%" + req.body.regionNameSearch + "%'"
                            mysql.pool.query(filterQuery, function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                compositeData.regions = rows;
                                res.render('regionEnemies.ejs', compositeData);
                            })
                        })
                        // UNFILTERED ENEMIES AND REGIONS
                    } else {
                        // POPULATING ENEMIES
                        let filterQuery = "SELECT E.enemyID, E.name AS 'enemyName', E.health, E.strength, E.itemID, E.dropChance, E.money, I.name AS 'itemName' FROM Enemies E LEFT JOIN Items I ON E.itemID = I.itemID"
                        mysql.pool.query(filterQuery, function(err, rows, fields){
                            if(err){
                                console.log(err);
                                return;
                            }
                            compositeData.enemies = rows;
                            // POPULATING REGIONS
                            let filterQuery = 'SELECT * FROM Regions'
                            mysql.pool.query(filterQuery, function(err, rows, fields){
                                if(err){
                                    console.log(err);
                                    return;
                                }
                                compositeData.regions = rows;
                                res.render('regionEnemies.ejs', compositeData);
                            })
                        })
                    }
                })
            })
        })
    }
})

module.exports = router;