
let token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login/";
}

let payload = JSON.parse(atob(token.split(".")[1]));
let userId = payload.user_id;

fetch("/api/library/bookissues/", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => res.json())
.then(data => {

    let issues = data.results || data;

    let myIssues = issues.filter(function(issue) {
        return issue.user == userId;
    });

    let html = "";

    myIssues.forEach(function(issue) {

        html += `
            <tr>
                <td>${issue.id}</td>
                <td>${issue.book}</td>
                <td>${issue.due_date}</td>
            </tr>
        `;

    });

    document.getElementById("issueTable").innerHTML = html;
});

