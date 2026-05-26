document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:9090/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.text())
    .then(data => {
        if (data === "LOGIN SUCCESS") {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userEmail", email);

            alert("Login successful");
            window.location.href = "upload.html";
        } else {
            alert("Invalid credentials");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
});
