document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons() {
    document.getElementById('charSearch').addEventListener('click', function(event) {
        fetch('/characterItems?action=charSearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then(response=>response.json())
    })
}