fetch('/employees',{
    body: JSON.stringify({
        "name": "Asta",
        "designation": "CEO",
        "date_of_joining": "2020-01-01",
    }),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.text())
.then(data => console.log(data))
.catch(error => console.log(error));