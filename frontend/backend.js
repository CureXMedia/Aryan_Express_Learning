
const form = document.getElementById("myForm");
form.addEventListener("submit", handleSubmit);
var outputBox = document.getElementById("outputBox");

async function handleSubmit(event) {
    event.preventDefault();
    var userInputValue = document.getElementById("userInput").value;
    fetch('/pipe',{
        body: JSON.stringify({question:userInputValue}),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res=>{
        console.log(res);
        return res.json()
    })
    .then(res=>{
        outputBox.innerText = "Output: "
        outputBox.innerText += res.text
        console.log(res)
    }).catch((err)=>console.log(err))
}  