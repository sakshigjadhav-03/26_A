

let highest = -1;

function addStudent() {
    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;
    let m1 = document.getElementById("m1").value;
    let m2 = document.getElementById("m2").value;
    let m3 = document.getElementById("m3").value;

    if (!name || !roll || m1 === "" || m2 === "" || m3 === "") {
        alert("Enter all details");
        return;
    }

    m1 = Number(m1);
    m2 = Number(m2);
    m3 = Number(m3);

    if ([m1, m2, m3].some(m => m < 0 || m > 100)) {
        alert("Marks must be between 0 and 100");
        return;
    }

    let total = m1 + m2 + m3;
    let percentage = (total / 300) * 100;

    let row = document.getElementById("result").insertRow();
    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = roll;
    row.insertCell(2).innerHTML = total;
    row.insertCell(3).innerHTML = percentage.toFixed(2) + "%";

    if (total > highest) {
        highest = total;
        document.getElementById("topper").innerHTML =
            "Topper: " + name + " (" + total + " marks)";
    }
}
