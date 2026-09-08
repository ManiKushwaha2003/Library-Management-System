
const USER_API = "/api/accounts/users/";

const token = localStorage.getItem("access");

const headers = {
    "Authorization": `Bearer ${token}`
};


window.onload = function () {

    loadUsers();

};


// LOAD USERS

async function loadUsers() {

    const res = await fetch(USER_API, {
        headers: headers
    });

    const data = await res.json();

    const users = data.results || data;

    let html = "";

    users.forEach(user => {

        html += `
            <tr>

                <td>${user.id}</td>

                <td>${user.username}</td>

                <td>${user.email}</td>

                <td>${user.role}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editUser(${user.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteUser(${user.id})">

                        Delete

                    </button>

                </td>

            </tr>
        `;

    });

    document.getElementById("userTable").innerHTML = html;

}


// SEARCH

document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = document.querySelectorAll("#userTable tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";

    });

});


// CLEAR FORM

function clearForm() {

    document.getElementById("userId").value = "";

    document.getElementById("username").value = "";

    document.getElementById("email").value = "";

    document.getElementById("password").value = "";

    document.getElementById("role").value = "ADMIN";

}


// EDIT USER

async function editUser(id) {

    const res = await fetch(USER_API + id + "/", {
        headers: headers
    });

    const user = await res.json();

    document.getElementById("userId").value = user.id;

    document.getElementById("username").value = user.username;

    document.getElementById("email").value = user.email;

    document.getElementById("role").value = user.role;

    document.getElementById("password").value = "";

    new bootstrap.Modal(
        document.getElementById("userModal")
    ).show();

}


// SAVE USER

async function saveUser() {

    const id = document.getElementById("userId").value;

    const body = {

        username: document.getElementById("username").value,

        email: document.getElementById("email").value,

        role: document.getElementById("role").value

    };

    const password = document.getElementById("password").value;

    if (password) {
        body.password = password;
    }

    const url = id
        ? USER_API + id + "/"
        : USER_API;

    const method = id
        ? "PUT"
        : "POST";


    const res = await fetch(url, {

        method: method,

        headers: {
            ...headers,
            "Content-Type": "application/json"
        },

        body: JSON.stringify(body)

    });


    if (res.ok) {

        alert("User saved successfully");

        bootstrap.Modal
            .getInstance(document.getElementById("userModal"))
            .hide();

        loadUsers();

    } else {

        const data = await res.json();

        alert(JSON.stringify(data));

    }

}


// DELETE USER

async function deleteUser(id) {

    if (!confirm("Delete this user?")) {
        return;
    }


    const res = await fetch(USER_API + id + "/", {

        method: "DELETE",

        headers: headers

    });


    if (res.ok) {

        alert("User deleted");

        loadUsers();

    } else {

        alert("Delete failed");

    }

}

