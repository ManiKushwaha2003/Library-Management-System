const USER_API = "/api/accounts/users/";
const LIBRARY_API = "/api/library/libraries/";
const BOOK_API = "/api/library/books/";
const ISSUE_API = "/api/library/bookissues/";

const token = localStorage.getItem("access");

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};

let userId = null;

window.onload = function () {

    getLoggedInUser();

    loadLibraries();

    loadMyBooks();

};

// ---------------- LOGGED USER ----------------

async function getLoggedInUser() {

    const payload = JSON.parse(atob(token.split(".")[1]));

    userId = payload.user_id;

    const res = await fetch(USER_API + userId + "/", {

        headers: headers

    });

    const user = await res.json();

    document.getElementById("welcomeUser").innerHTML =
        "Welcome " + user.username;

}

// ---------------- LOAD LIBRARIES ----------------

async function loadLibraries() {

    const res = await fetch(LIBRARY_API, {

        headers: headers

    });

    const data = await res.json();

    let option = `
        <option value="">
            Select Library
        </option>
    `;

    data.results.forEach(lib => {

        option += `
            <option value="${lib.id}">
                ${lib.library_name}
            </option>
        `;

    });

    document.getElementById("library").innerHTML = option;

}

// ---------------- LOAD BOOKS ----------------

async function loadBooksByLibrary() {

    const libraryId = document.getElementById("library").value;

    if (libraryId == "") {

        document.getElementById("bookTable").innerHTML = "";

        document.getElementById("totalBooks").innerHTML = 0;

        return;

    }

    const bookRes = await fetch(BOOK_API, {

        headers: headers

    });

    const issueRes = await fetch(ISSUE_API, {

        headers: headers

    });

    const books = await bookRes.json();

    const issues = await issueRes.json();

    let html = "";

    let total = 0;

    books.results.forEach(book => {

        if (book.library == libraryId) {

            total++;

            const issued = issues.some(item => item.book == book.id);

            html += `
                <tr>

                    <td>${book.id}</td>

                    <td>${book.book_name}</td>

                    <td>${book.author_name}</td>

                    <td>

                        <button
                            class="btn btn-success btn-sm"
                            onclick="issueBook(${book.id})"
                            ${issued ? "disabled" : ""}>

                            ${issued ? "Issued" : "Issue Book"}

                        </button>

                    </td>

                </tr>
            `;

        }

    });

    document.getElementById("bookTable").innerHTML = html;

    document.getElementById("totalBooks").innerHTML = total;

}

// ---------------- ISSUE BOOK ----------------

async function issueBook(bookId) {

    const payload = JSON.parse(atob(token.split(".")[1]));

    const today = new Date();

    today.setDate(today.getDate() + 7);

    const dueDate = today.toISOString().split("T")[0];

    const body = {

        user: payload.user_id,

        book: bookId,

        due_date: dueDate

    };

    const res = await fetch(ISSUE_API, {

        method: "POST",

        headers: headers,

        body: JSON.stringify(body)

    });

    const data = await res.json();

    if (res.ok) {

        alert("Book Issued Successfully");

        loadMyBooks();

        loadBooksByLibrary();

    } else {

        alert(data.msg || "Unable to issue book");

    }

}

// ---------------- MY BOOKS COUNT ----------------

async function loadMyBooks() {

    const res = await fetch(ISSUE_API, {

        headers: headers

    });

    const data = await res.json();

    document.getElementById("myBooks").innerHTML = data.length;

}