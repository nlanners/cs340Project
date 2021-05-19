document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    document.getElementById('charSearch').addEventListener('click', function(event) {
        var payload = {};
        payload.charName = document.getElementById('charName').value;
        searchRequest(payload, 'charSearch');
        event.preventDefault();
        event.stopPropagation();
    })

    document.getElementById('itemSearch').addEventListener('click', function(event) {
        var payload = {};
        payload.itemName = document.getElementById('itemName').value;
        searchRequest(payload, 'itemSearch');
        event.preventDefault();
        event.stopPropagation();
    })
}

function removeAllChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function searchRequest(payload, action) {
    fetch('/characterItems?action=' + action, {
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
            }

     }).catch((error) => {
            console.error('Error: ', error);
     });
}

function characterSearch(data) {
    console.log('Success: ', JSON.stringify(data));
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
        document.getElementById('charBody').appendChild(newRow);
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
        document.getElementById('itemBody').appendChild(newRow);
        document.getElementById('itemName').value = null;
    });
}