var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var path = require('path');
var ejs = require('express-ejs-layouts');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(express.static('public'));
app.use(ejs);


app.set('port', 65535);
app.set('view engine', 'ejs');


var pool = mysql.createPool({
  connectionLimit: 10,
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs340_bailemer',
  password: '6091',
  database: 'cs340_bailemer'
});


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
    let itemData = {}
    // ACTION HANDLER FOR FILTERING
    if (req.query.action == 'filter') {
        let filterQuery = 'SELECT * FROM Items WHERE name LIKE ' + "'%" + req.query.name + "%'"
        pool.query(filterQuery, function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.results = rows;
            console.log('itemData:', itemData);
            res.render('items.ejs', itemData);
            console.log('after render')
        });
    // ACTION HANDLER FOR VIEWING ALL
    } else {
        pool.query('SELECT * FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.results = rows;
            res.render('items.ejs', itemData);
        });
    }
})

app.post('/items', function(req, res, next) {
    let itemData = {}
    // ACTION HANDLER FOR FILTERING
    console.log(req.body.name)
    let filterQuery = 'SELECT * FROM Items WHERE name LIKE ' + "'%" + req.body.name + "%'"
    pool.query(filterQuery, function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        itemData.results = rows;
        console.log('itemData:', itemData);
        res.render('items.ejs', itemData);
    });
})

app.get('/addRemoveItems', function(req, res, next) {
    let itemData = {}
    // POPULATING DROP DOWN ID MENU
    pool.query('SELECT itemID FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.itemIDs = rows;
            res.render('addRemoveItems.ejs', itemData);
    });
})

app.post('/addRemoveItems', function(req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        console.log(req.body["name"], req.body["damage"], req.body["cost"]);
        pool.query("INSERT INTO Items (name, damage, cost) VALUES (?, ?, ?)", [req.body["name"], req.body["damage"], req.body["cost"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        });
    // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        // replace with a DELETE query
        console.log(req.body["id"])
    }
    // POPULATING DROP DOWN ID MENU
    let itemData = {}
    pool.query('SELECT itemID FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            itemData.itemIDs = rows;
            res.render('addRemoveItems.ejs', itemData)
    });
})

app.get('/alterItems', function(req, res, next) {
    let itemData = {}
    // fake data will be replaced with a SELECT query to get all ids from items table
    itemData.itemIDs = [1, 2, 3, 4]
    res.render('alterItems.ejs', itemData);
})

app.post('/alterItems', function(req, res, next) {
    console.log(req.body['id'], req.body['name'], req.body['damage'], req.body['cost'])
    let itemData = {}
    // fake data will be replaced with a SELECT query to get all ids from items table
    itemData.itemIDs = [1, 2, 3, 4]
    res.render('alterItems.ejs', itemData);
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
    let enemyData = {}
    // ACTION HANDLER FOR VIEWING ALL
    pool.query('SELECT * FROM Enemies', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        enemyData.results = rows;
        res.render('enemies.ejs', enemyData);
    });
})

app.post('/enemies', function(req, res, next) {
    let enemyData = {}
    // ACTION HANDLER FOR FILTERING
    let filterQuery = 'SELECT * FROM Enemies WHERE name LIKE ' + "'%" + req.body.name + "%'"
        pool.query(filterQuery, function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.results = rows;
            res.render('enemies.ejs', enemyData);
        });
})

app.get('/addRemoveEnemies', function(req, res, next) {
    let enemyData = {}
    // POPULATING DROP DOWN ENEMY ID MENU FOR DELETE
    pool.query('SELECT enemyID FROM Enemies', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.enemyIDs = rows;
            // POPULATING ITEM ID MENU FOR INSERT
            pool.query('SELECT itemID FROM Items', function(err, rows, fields){
                if(err){
                    console.log(err);
                    return;
                }
                enemyData.itemIDs = rows;
                res.render('addRemoveEnemies.ejs', enemyData)
            });
    });
})

app.post('/addRemoveEnemies', function(req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        let dropChance = null
        let money = null
        if (req.body['dropChance']) {
            dropChance = req.body['dropChance']
        }
        if (req.body['money']) {
            money = req.body['money']
        }
        pool.query("INSERT INTO Enemies (name, health, strength, itemID, dropChance, money) VALUES (?, ?, ?, ?, ?, ?)", [req.body["name"], req.body["health"], req.body["strength"], req.body["itemID"], dropChance, money], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        });
    // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        // replace with a DELETE query
        console.log(req.body["id"])
    }
    // POPULATING DROP DOWN ENEMY ID MENU FOR DELETE
    let enemyData = {}
    pool.query('SELECT enemyID FROM Enemies', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        enemyData.enemyIDs = rows;
        // POPULATING ITEM ID MENU FOR INSERT
        pool.query('SELECT itemID FROM Items', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            enemyData.itemIDs = rows;
            res.render('addRemoveEnemies.ejs', enemyData)
        });
    });
})

app.get('/alterEnemies', function(req, res, next) {
    res.render('alterEnemies.ejs');
})

app.get('/regions', function(req, res, next) {
    let regionData = {}      
    // ACTION HANDLER FOR VIEWING ALL
    pool.query('SELECT * FROM Regions', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        regionData.results = rows;
        res.render('regions.ejs', regionData);
    });
})

app.post('/regions', function(req, res, next) {
    let regionData = {}
    // ACTION HANDLER FOR FILTERING
    let filterQuery = 'SELECT * FROM Regions WHERE name LIKE ' + "'%" + req.body.name + "%'"
        pool.query(filterQuery, function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            regionData.results = rows;
            res.render('regions.ejs', regionData);
        });
})

app.get('/addRemoveRegions', function(req, res, next) {
    let regionData = {}
    // POPULATING DROP DOWN ID MENU
    pool.query('SELECT regionID FROM Regions', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            regionData.regionIDs = rows;
            res.render('addRemoveRegions.ejs', regionData);
    });
})

app.post('/addRemoveRegions', function(req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        pool.query("INSERT INTO Regions (name) VALUES (?)", [req.body["name"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        });
    // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        // replace with a DELETE query
        console.log(req.body["id"])
    }
    // POPULATING DROP DOWN ID MENU
    let regionData = {}
    pool.query('SELECT regionID FROM Regions', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            regionData.regionIDs = rows;
            res.render('addRemoveRegions.ejs', regionData)
    });
})

app.get('/alterRegions', function(req, res, next) {
    res.render('alterRegions.ejs');
})

app.get('/regionEnemies', function (req, res, next) {
    let compositeData = {}
    // POPULATING DROP DOWN REGION ID MENU
    pool.query('SELECT regionID FROM Regions', function(err, rows, fields){
        if(err){
            console.log(err);
            return;
        }
        compositeData.regionIDs = rows;
        // POPULATING DROP DOWN ENEMY ID MENU
        pool.query('SELECT enemyID FROM Enemies', function(err, rows, fields){
            if(err){
                console.log(err);
                return;
            }
            compositeData.enemyIDs = rows;
            // POPULATING ENEMIES
            pool.query('SELECT * FROM Enemies', function(err, rows, fields){
                if(err){
                    console.log(err);
                    return;
                }
                compositeData.enemies = rows;
                // POPULATING REGIONS
                pool.query('SELECT * FROM Regions', function(err, rows, fields){
                    if(err){
                        console.log(err);
                        return;
                    }
                    compositeData.regions = rows;
                    // POPULATING COMPOSITE TABLE
                    pool.query("SELECT R.regionID, R.name AS 'regionName', E.enemyID, E.name AS 'enemyName' FROM Regions R JOIN RegionEnemies RE ON R.regionID = RE.regionID JOIN Enemies E ON E.enemyID = RE.enemyID ORDER BY E.enemyID ASC;", function(err, rows, fields){
                        if(err){
                            console.log(err);
                            return;
                        }
                        compositeData.joins = rows;
                        res.render('RegionEnemies.ejs', compositeData);
                    })
                })
            })
        })
    })
})

app.post('/regionEnemies', function (req, res, next) {
    // ACTION HANDLER FOR INSERT
    if (req.query.action == "add") {
        pool.query("INSERT INTO RegionEnemies (enemyID, regionID) VALUES (?, ?)", [req.body["enemyID"], req.body["regionID"]], function(err, result){
            if(err){
                console.log(err);
                return;
            }
        });
    // ACTION HANDLER FOR DELETE
    } else if (req.query.action == "delete") {
        // replace with a DELETE query
        console.log(req.body["id"])
    }
})

app.listen(app.get('port'), function(){
    console.log('Express started on flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});