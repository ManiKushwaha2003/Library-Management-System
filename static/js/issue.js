const ISSUE_API = "/api/library/bookissues/";
const USER_API = "/api/accounts/users/";
const BOOK_API = "/api/library/books/";

const token = localStorage.getItem("access");

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

window.onload = function () {

    loadUsers();
    loadBooks();
    loadIssues();

    document.getElementById("issueModal").addEventListener("hidden.bs.modal", function () {
        clearForm();
    });

};

// ---------------- USERS ----------------

async function loadUsers(){

    const res = await fetch(USER_API,{
        headers:headers
    });

    const data = await res.json();

    let option = `<option value="">Select User</option>`;

    data.results.forEach(user=>{

        option += `
        <option value="${user.id}">
            ${user.username}
        </option>
        `;

    });

    document.getElementById("user").innerHTML = option;

}

// ---------------- BOOKS ----------------

async function loadBooks(){

    const res = await fetch(BOOK_API,{
        headers:headers
    });

    const data = await res.json();

    let option = `<option value="">Select Book</option>`;

    data.results.forEach(book=>{

        option += `
        <option value="${book.id}">
            ${book.book_name}
        </option>
        `;

    });

    document.getElementById("book").innerHTML = option;

}

// ---------------- ISSUE LIST ----------------

async function loadIssues(){

    const res = await fetch(ISSUE_API,{
        headers:headers
    });

    const data = await res.json();

    let html = "";

    data.forEach(issue=>{

        html += `
        <tr>

            <td>${issue.id}</td>

            <td>${issue.user}</td>

            <td>${issue.book}</td>

            <td>${issue.due_date}</td>

            <td>

                <button class="btn btn-warning btn-sm"
                onclick="editIssue(${issue.id})">
                Edit
                </button>

                <button class="btn btn-danger btn-sm"
                onclick="deleteIssue(${issue.id})">
                Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("issueTable").innerHTML = html;

}

// ---------------- SAVE ----------------

async function saveIssue(){

    const id = document.getElementById("issueId").value;

    const body = {

        user: document.getElementById("user").value,

        book: document.getElementById("book").value,

        due_date: document.getElementById("due_date").value

    };

    let url = ISSUE_API;
    let method = "POST";

    if(id){

        url = ISSUE_API + id + "/";
        method = "PUT";

    }

    const res = await fetch(url,{

        method:method,

        headers:headers,

        body:JSON.stringify(body)

    });

    const result = await res.json();

    if(res.ok){

        alert(method=="POST" ? "Book Issued" : "Issue Updated");

        bootstrap.Modal.getInstance(
        document.getElementById("issueModal")).hide();

        clearForm();

        loadIssues();

    }else{

        alert(result.msg || "Something went wrong");

    }

}

// ---------------- EDIT ----------------

async function editIssue(id){
    clearForm();

    const res = await fetch(ISSUE_API,{
        headers:headers
    });

    const data = await res.json();

    const issue = data.find(x=>x.id==id);

    document.getElementById("issueId").value = issue.id;

    document.getElementById("user").value = issue.user;

    document.getElementById("book").value = issue.book;

    document.getElementById("due_date").value = issue.due_date;

    new bootstrap.Modal(
    document.getElementById("issueModal")).show();

}

// ---------------- DELETE ----------------

async function deleteIssue(id){

    if(!confirm("Delete Issue ?")) return;

    const res = await fetch(ISSUE_API+id+"/",{

        method:"DELETE",

        headers:headers

    });

    if(res.ok){

        alert("Deleted");

        loadIssues();

    }

}

// ---------------- CLEAR ----------------

function clearForm(){

    document.getElementById("issueId").value = "";

    document.getElementById("user").value = "";

    document.getElementById("book").value = "";

    document.getElementById("due_date").value = "";

}

// ---------------- SEARCH ----------------

document.getElementById("search").addEventListener("keyup",function(){

    const value = this.value.toLowerCase();

    document.querySelectorAll("#issueTable tr").forEach(row=>{

        row.style.display = row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";

    });

});