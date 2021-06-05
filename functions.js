var mysql = require('./public/js/sqlPool.js');

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
    mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
        errorCheck(err, next);
        context.characterIDs = rows;
        // regionID dropdown
        mysql.pool.query('SELECT regionID, name FROM Regions ORDER BY regionID ASC', function (err, rows, fields) {
            errorCheck(err, next);
            context.regionIDs = rows;
            res.render('addRemoveCharacters.ejs', context);
        });
    });
}

// queries to create FK dropdowns in addRemoveSpells
function getSpellsDropdowns(res, next, context) {
    // spellID dropdown
    mysql.pool.query('SELECT spellID, name FROM Spells ORDER BY spellID ASC', function(err, rows, fields) {
        errorCheck(err, next);
        context.spellIDs = rows;
        // characterID dropdown
        mysql.pool.query('SELECT characterID, name FROM Characters ORDER BY characterID ASC', function(err, rows, fields) {
            errorCheck(err, next);
            context.characterIDs = rows;
            res.render('addRemoveSpells.ejs', context);
        })
    })
}

module.exports.errorCheck = errorCheck;
module.exports.charDrops = getCharsDropdowns;
module.exports.spellDrops = getSpellsDropdowns;