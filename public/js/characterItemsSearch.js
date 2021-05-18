document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    document.getElementById('charSearch').addEventListener('click', function(event) {
        var payload = { thing: 'happened' }
        fetch('/characterItems?action=charSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(response=>response.json())
            .then( data => {console.log('Success: ', data);
        })
            .catch((error) => {
                console.error('Error: ', error);
            });
    })
}