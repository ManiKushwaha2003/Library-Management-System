
let token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login/";
}

let libraryId = window.location.pathname.split("/")[2];

async function loadBooks(url) {

    let response = await fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    let data = await response.json();

    let books = data.results || data;

    let html = "";

    books.forEach(function(book) {

        if (book.library == libraryId) {

            html += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.book_name}</td>
                    <td>${book.author_name}</td>
                </tr>
            `;

        }

    });

    document.getElementById("bookTable").innerHTML += html;

    if (data.next) {
        loadBooks(data.next);
    }
}

loadBooks("/api/library/books/");

