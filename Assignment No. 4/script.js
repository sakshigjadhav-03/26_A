
document.getElementById("employeeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let phone = document.getElementById("phone").value.trim();
    let department = document.getElementById("department").value;
    let gender = document.getElementById("gender").value;
    let joining = document.getElementById("joining").value;
    let message = document.getElementById("message");

    message.style.color = "red";

    if (!/^[A-Za-z ]+$/.test(name)) {
        message.textContent = "Enter a valid name.";
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.textContent = "Enter a valid email.";
        return;
    }

    if (password.length < 8) {
        message.textContent = "Password must have 8 characters.";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        message.textContent = "Enter a valid 10-digit phone number.";
        return;
    }

    if (!department || !gender || !joining) {
        message.textContent = "Please complete all fields.";
        return;
    }

    if (joining > new Date().toLocaleDateString("en-CA")) {
        message.textContent = "Joining date cannot be in the future.";
        return;
    }

    message.style.color = "green";
    message.textContent = "Employee Registered Successfully!";

});

document.getElementById("employeeForm").addEventListener("reset", function() {
    document.getElementById("message").textContent = "";
});
document.getElementById("employeeForm").addEventListener("reset", function() {
    document.getElementById("message").textContent = "";
});
