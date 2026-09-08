let token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login/";
}

let payload = JSON.parse(atob(token.split(".")[1]));

let userId = payload.user_id;

async function loadProfile() {

    let response = await fetch(
        "/api/accounts/users/" + userId,
        {
            headers: {
                "Authorization": "Bearer " + token
            }
        }
    );

    let data = await response.json();

    document.getElementById("username").innerText = data.username;
    document.getElementById("email").innerText = data.email;
    document.getElementById("firstName").innerText = data.first_name;
    document.getElementById("lastName").innerText = data.last_name;
}

loadProfile();