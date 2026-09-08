const API = "/api/accounts/login/";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");
const token = localStorage.getItem("access");



if (token) {

    const payload = JSON.parse(atob(token.split(".")[1]));

    fetch("/api/accounts/users/" + payload.user_id , {

        headers: {
            "Authorization": `Bearer ${token}`
        }

    })
    .then(res => res.json())
    .then(user => {

        if (user.role === "ADMIN") {

            window.location.href = "/dashboard/";

        } else {

            window.location.href = "/user-dashboard/";

        }

    });

}

form.addEventListener("submit", loginUser);

async function loginUser(e) {

    e.preventDefault();

    const btn = form.querySelector("button");

    btn.disabled = true;
    btn.innerHTML = "Please Wait...";

    msg.innerHTML = "";

    const data = {
        username: document.getElementById("username").value.trim(),
        password: document.getElementById("password").value.trim()
    };

    try {

        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {

            // localStorage.setItem("access", result.access);
            // localStorage.setItem("refresh", result.refresh);

            // msg.innerHTML = `
            //     <div class="alert alert-success">
            //         Login Successful...
            //     </div>
            // `;

            // setTimeout(() => {
            //     window.location.href = "/dashboard/";
            // }, 800);
            localStorage.setItem("access", result.access);
localStorage.setItem("refresh", result.refresh);

msg.innerHTML = `
<div class="alert alert-success">
    Login Successful...
</div>
`;

const token = result.access;

// JWT payload
const payload = JSON.parse(atob(token.split(".")[1]));

const userId = payload.user_id;

// Logged-in user details
const userResponse = await fetch("/api/accounts/users/" + userId , {
    headers: {
        "Authorization": `Bearer ${token}`
    }
});

const user = await userResponse.json();




setTimeout(() => {

    if (user.role === "ADMIN") {

        window.location.href = "/dashboard/";

    } else {

        window.location.href = "/user-dashboard/";


    }
    

}, 500);

        } else {

            msg.innerHTML = `
                <div class="alert alert-danger">
                    Invalid Username or Password
                </div>
            `;

        }

    } catch (error) {

        console.log(error);

        msg.innerHTML = `
            <div class="alert alert-danger">
                Server Error
            </div>
        `;

    }

    btn.disabled = false;
    btn.innerHTML = "Login";

}


// ---------- Helper Functions ----------

function getToken() {
    return localStorage.getItem("access");
}

function authHeader() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };

}

function logout() {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.location.href = "/login/";

}


// Token Expired
window.addEventListener("load", () => {

    if (!getToken()) {

        if (!window.location.pathname.includes("login")) {
            window.location.href = "/login/";
        }

    }

});

