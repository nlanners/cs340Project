-- CHARACTERS

-- select from Characters for Characters page
SELECT C.*, R.name as regionName FROM Characters C
LEFT JOIN Regions R ON C.regionID = R.regionID;

-- select attributes for characterItems page
SELECT characterID, name, strength, money FROM Characters;

-- select rows for Characters Search Bar
SELECT C.*, R.name as regionName FROM Characters C
LEFT JOIN Regions R ON C.regionID = R.regionID
WHERE C.name LIKE :charactername;

-- select Character ID and name for dropdown menus
SELECT characterID, name FROM Characters
ORDER BY characterID ASC;

-- select Region ID and name for dropdown menus
SELECT regionID, name FROM Regions
ORDER BY regionID ASC;

-- add Character
-- variables from Add Character form
INSERT INTO Characters (name, health, enemiesKilled, magic, strength, money, regionID)
VALUES (:name, :health, :enemiesKilled, :magic, :strength, :money, :regionID);

-- remove Character
-- characterID from Remove Character form
DELETE FROM Characters WHERE characterID = :characterID;

-- select current values for Characters for update query
-- variable from Alter Character form
SELECT * FROM Characters WHERE characterID = :characterID;

-- update Character
-- variables from Alter Character form
-- current values from database
UPDATE Characters
SET name = :characterName || :currentValue, health = :health || :currentValue, enemiesKilled = :enemiesKilled || :currentValue, magic = :magic || :currentValue, strength = :strength || :currentValue, money = :money || :currentValue, regionID = :regionID || :currentValue
WHERE characterID = :characterID;


-- SPELLS

-- select from Spells for Spells page
SELECT S.*, C.name as characterName FROM Spells S
JOIN Characters C ON S.characterID = C.characterID;

-- select Spell ID and name for dropdowns
SELECT spellID, name FROM Spells
ORDER BY spellID ASC;

-- select Character ID and name for dropdowns
SELECT characterID, name FROM Characters
ORDER BY characterID ASC;

-- add spell
-- variables from Add Spell form
INSERT INTO Spells (name, buyCost, upgradeCost, strength, characterID)
VALUES (:name, :purchaseCost, :upgradeCost, : strength, :characterID);

-- remove Spell
-- variables from Remove Spell form
DELETE FROM Spells WHERE spellID = :spellID;

-- select current values for Spells for update query
-- variable from Alter Spells form
SELECT * FROM Spells WHERE spellID = :spellID

-- update Spell
-- variables from Alter Spell form
-- current values from database
UPDATE Spells
SET name = :spellName || :currentValue, buyCost = :purchaseCost || :currentValue, upgradeCost = :upgradeCost || :currentValue, strength = :strength || :currentValue
WHERE spellID = :spellID;




-- ITEMS

-- select from Items for Items page
SELECT * FROM Items;

-- select attributes for CharacterItems page
SELECT itemID, name, damage, cost FROM Items;

-- add item
-- using variables from Add Item form
INSERT INTO Items (name, damage, cost)
VALUES (:name, :damage, :cost);

-- remove item
-- using itemID from Remove Item form
DELETE FROM Items WHERE itemID = :itemID;

-- select current values for Items for update query
-- using variables from Alter Item form
SELECT * FROM Items WHERE itemID = :itemID;

-- update Item
-- variables from Alter Item form
-- current values from database
UPDATE Items
SET name = :itemName || :currentItemNameValue, damage = :damage || :currentDamageValue, cost = :cost || :currentCostValue
WHERE itemID = :itemID;

-- assign Item to Character
-- variables from Add Item to Character form
INSERT INTO characterItems (itemID, characterID)
VALUES (:itemID, :characterID);

-- remove Item from Character
-- variables from Remove Item from Character
DELETE FROM characterItems WHERE itemID = :itemID AND characterID = :characterID;

-- select and join Characters with Items for characterItems page
SELECT C.characterID, C.name, I.itemID, I.name
FROM Characters C
JOIN CharacterItems CI ON C.characterID = CI.characterID
JOIN Items I ON I.itemID = CI.itemID
ORDER BY C.characterID ASC;



-- REGIONS

-- select from Regions for Regions page
SELECT * FROM Regions;

-- select attributes for RegionEnemies page
SELECT regionID, name FROM Regions;

-- add region
-- using variables from Add Region form
INSERT INTO Regions (name)
VALUES (:name);

-- remove region
-- using regionID from Remove Regions form
DELETE FROM Regions WHERE regionID = :regionID;

-- select current values for Regions for update query
-- using variables from Alter Regions form
SELECT * FROM Regions WHERE regionID = :regionID

-- update Region
-- using variables from Alter Region form
-- or current values from database
UPDATE Regions
SET name = :regionName || :currentNameValue
WHERE regionID = :regionID;

-- REGION ENEMIES

-- select and join Regions with Enemies for RegionEnemies page
SELECT R.regionID, R.name, E.enemyID, E.name
FROM Regions R
JOIN RegionEnemies RE ON R.regionID = RE.regionID
JOIN Enemies E ON E.enemyID = RE.enemyID
ORDER BY E.enemyID ASC;


-- assign Enemy to Region
-- variables from Add Enemy to Region form
INSERT INTO RegionEnemies (enemyID, regionID)
VALUES (:enemyID, :regionID);

-- remove Enemy from Region
-- variables from Remove Enemy from Region form
DELETE FROM RegionEnemies WHERE enemyID = :enemyID AND regionID = :regionID;


-- ENEMIES

-- select from Enemies for Enemies page
SELECT * FROM Enemies;

-- select attributes for RegionEnemies page
SELECT enemyID, name, health, strength, itemID, dropChance, money FROM Enemies;

-- add enemy
-- using variables from Add Enemy form
INSERT INTO Enemies (name, health, strength, itemID, dropChance, money)
VALUES (:name, :health, :strength, :itemID, :dropChance, money);

-- remove enemy
-- using enemyID from Remove Enemy form
DELETE FROM Enemies WHERE enemyID = :enemyID;

-- select current values for Enemies for update query
-- using variable from Alter Enemy form
SELECT * FROM Enemies WHERE enemyID = :enemyID;

-- update Enemy
-- using variables from Alter Enemy form
-- or current values from database
UPDATE Enemies
SET name = :enemyName || :currentEnemyNameValue, health = :health || :currentHealthValue, strength = :strength || :currentStrengthValue, itemID = :itemID || :currentItemIDValue, dropChance = :dropChance || :currentDropChanceValue, money = :money || :currentMoneyValue 
WHERE enemyID = :enemyID;






