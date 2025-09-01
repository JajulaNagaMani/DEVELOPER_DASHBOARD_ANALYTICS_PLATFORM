const CUST_URL = "http://localhost:3000/customers";
const NOTE_URL = "http://localhost:3000/notifications";

let custList = [];
let boughtChart, returnChart, pie;

// get customers from server
async function getCustomers() {
    try {
        let res = await fetch(CUST_URL);
        custList = await res.json();
        showCustomers();
        showCharts();
    } catch(e) {
        console.log("error in loading", e);
    }
}

// show customers on screen
function showCustomers() {
    let box = document.getElementById("customerContainer");
    box.innerHTML = "";

    custList.forEach(c => {
        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${c.name}</h3>
            <p>${c.email}</p>
            <p>Bought: ${c.bought}</p>
            <p>Returned: ${c.returned}</p>
            <button onclick="removeCustomer(${c.id})">Delete</button>
        `;
        box.appendChild(div);
    });
}

// add customer
async function addCustomer() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let bought = parseInt(document.getElementById("bought").value) || 0;
    let returned = parseInt(document.getElementById("returned").value) || 0;

    if(name==="" || email==="") {
        alert("enter name and email");
        return;
    }

    let res = await fetch(CUST_URL, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name,email,bought,returned})
    });

    let newCust = await res.json();
    alert("added " + newCust.name);
    getCustomers();
    getNotes();
}

// delete customer
async function removeCustomer(id) {
    await fetch(CUST_URL + "/" + id, {method:"DELETE"});
    alert("customer deleted");
    getCustomers();
    getNotes();
}

// get notifications
async function getNotes() {
    try {
        let res = await fetch(NOTE_URL);
        let notes = await res.json();
        if(notes.length > 0) {
            let last = notes[notes.length-1];
            alert("🔔 " + last.message);
        }
    } catch(e) {
        console.log("error in notes", e);
    }
}

// show charts
function showCharts() {
    let names = custList.map(c => c.name);
    let boughtArr = custList.map(c => c.bought);
    let returnArr = custList.map(c => c.returned);

    if(boughtChart) boughtChart.destroy();
    if(returnChart) returnChart.destroy();
    if(pie) pie.destroy();

    boughtChart = new Chart(document.getElementById("barChartBought"), {
        type: "bar",
        data: {
            labels: names,
            datasets: [{label: "Bought", data: boughtArr}]
        }
    });

    returnChart = new Chart(document.getElementById("barChartReturned"), {
        type: "bar",
        data: {
            labels: names,
            datasets: [{label: "Returned", data: returnArr}]
        }
    });

    pie = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: names,
            datasets: [{label:"Bought", data: boughtArr}]
        }
    });
}

// start
window.onload = function() {
    getCustomers();
    getNotes();
}

