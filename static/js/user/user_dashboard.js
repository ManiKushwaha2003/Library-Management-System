
let token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login/";
}

let payload = JSON.parse(atob(token.split(".")[1]));
let userId = payload.user_id;

let headers = {
    "Authorization": "Bearer " + token
};


getUser();
loadIssues();
loadLibraries();


async function getUser() {

    let res = await fetch(
        "/api/accounts/users/" + userId,
        {
            headers: headers
        }
    );

    let user = await res.json();

    document.getElementById("profileName").innerText =
        user.username;
}


async function loadIssues() {

    let res = await fetch(
        "/api/library/bookissues/",
        {
            headers: headers
        }
    );

    let data = await res.json();

    let issues = data.results || data;

    let myIssues = issues.filter(function(item) {
        return item.user == userId;
    });

    document.getElementById("issueCount").innerText =
        myIssues.length;
}


async function loadLibraries() {

    let res = await fetch(
        "/api/library/libraries/",
        {
            headers: headers
        }
    );

    let data = await res.json();

    let libraries = data.results || data;

    document.getElementById("libraryCount").innerText =
        libraries.length;
}

