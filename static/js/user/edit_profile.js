
let token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login/";
}

let payload = JSON.parse(atob(token.split(".")[1]));
let userId = payload.user_id;

async function loadProfile() {

    let response = await fetch(
        "/api/accounts/users/" + userId + "/",
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    let data = await response.json();

    document.getElementById("username").value = data.username;
    document.getElementById("email").value = data.email;
    document.getElementById("firstName").value = data.first_name;
    document.getElementById("lastName").value = data.last_name;
}

async function updateProfile() {

    let data = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value
    };

    let response = await fetch(
        "/api/accounts/users/" + userId + "/",
        {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );

    let result = await response.text();

    console.log("STATUS:", response.status);
    console.log("RESPONSE:", result);

    if (response.ok) {
        alert("Profile Updated");
        window.location.href = "/user-profile/";
    } else {
        alert("Update Failed");
    }
}

loadProfile();

