document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    console.log('loaded');
    document.getElementById('charSearch').addEventListener('click', function(event) {
        var payload = {};
        payload.charName = document.getElementById('charName').value;
        fetchRequest(payload, 'charSearch');
        event.preventDefault();
        event.stopPropagation();
    })

    document.getElementById('itemSearch').addEventListener('click', function(event) {
        var payload = {};
        payload.itemName = document.getElementById('itemName').value;
        fetchRequest(payload, 'itemSearch');
        event.preventDefault();
        event.stopPropagation();
    })

    document.getElementById('add').addEventListener('click', function(event) {
        var payload = {};
        payload.characterID = document.getElementById('charID').value;
        payload.itemID = document.getElementById('itemID').value;
        fetchRequest(payload, 'add');
        event.preventDefault();
        event.stopPropagation();
    })

    document.getElementById('delete').addEventListener('click', function(event) {
        var payload = {};
        payload.characterID = document.getElementById('removeCharID').value;
        payload.itemID = document.getElementById('removeItemID').value;
        fetchRequest(payload, 'delete');
        event.preventDefault();
        event.stopPropagation();
    })
}

function removeAllChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function fetchRequest(payload, action) {
    fetch('/items/characterItems?action=' + action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(function(response){
            return response.json();
        }).then(function(data) {
            if (action === 'charSearch'){
                characterSearch(data);
            } else if (action === 'itemSearch'){
                itemSearch(data);
            } else if (action === 'add'){
                addRow(data);
            } else if (action === 'delete'){
                deleteRow(data);
            }

     }).catch((error) => {
            console.error('Error: ', error);
     });
}

function characterSearch(data) {
    var tbody = document.getElementById('charBody');
    removeAllChildNodes(tbody);
    data.table.forEach(function(row) {
        var newRow = document.createElement('tr');
        var charID = document.createElement('td');
        charID.textContent = row.characterID;
        var name = document.createElement('td');
        name.textContent = row.name;
        var strength = document.createElement('td');
        strength.textContent = row.strength;
        var money = document.createElement('td');
        money.textContent = row.money;
        newRow.appendChild(charID);
        newRow.appendChild(name);
        newRow.appendChild(strength);
        newRow.appendChild(money);
        tbody.appendChild(newRow);
        document.getElementById('charName').value = null;
    });
}

function itemSearch(data) {
    var tbody = document.getElementById('itemBody');
    removeAllChildNodes(tbody);
    data.table.forEach(function(row) {
        var newRow = document.createElement('tr');
        var itemID = document.createElement('td');
        itemID.textContent = row.itemID;
        var name = document.createElement('td');
        name.textContent = row.name;
        var damage = document.createElement('td');
        damage.textContent = row.damage;
        var cost = document.createElement('td');
        cost.textContent = row.cost;
        newRow.appendChild(itemID);
        newRow.appendChild(name);
        newRow.appendChild(damage);
        newRow.appendChild(cost);
        tbody.appendChild(newRow);
        document.getElementById('itemName').value = null;
    });
}

function addRow(data) {
    var addStatus = document.getElementById('addStatus');
    if (data.reqStatus === 'Success') {
        addStatus.textContent = 'Successfully Assigned Item to Character.';
    } else {
        addStatus.textContent = 'Oops! Something went wrong!';
    }
    updateJoinedTable(data);
}

function deleteRow(data) {
    var deleteStatus = document.getElementById('deleteStatus');
    if (data.reqStatus === 'Success') {
        deleteStatus.textContent = 'Successfully Removed Item from Character.';
    } else {
        deleteStatus.textContent = 'Oops! Something went wrong!';
    }
    updateJoinedTable(data);
}

function updateJoinedTable(data) {
    var tbody = document.getElementById('joinedBody');
    removeAllChildNodes(tbody);
    data.table.forEach(function(row) {
        var newRow = document.createElement('tr');
        var charID = document.createElement('td');
        charID.textContent = row.characterID;
        var charName = document.createElement('td');
        charName.textContent = row.charName;
        var itemID = document.createElement('td');
        itemID.textContent = row.itemID;
        var itemName = document.createElement('td');
        itemName.textContent = row.itemName;
        newRow.appendChild(charID);
        newRow.appendChild(charName);
        newRow.appendChild(itemID);
        newRow.appendChild(itemName);
        tbody.appendChild(newRow);
    })
}
