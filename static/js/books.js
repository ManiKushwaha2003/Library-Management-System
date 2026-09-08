const BOOK_API = "/api/library/books/";
const LIBRARY_API = "/api/library/libraries/";

const token = localStorage.getItem("access");

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

let currentPage = 1;

window.onload = function () {

    loadLibraries();
    loadBooks();

    document.getElementById("bookModal").addEventListener("hidden.bs.modal", function () {

        clearForm();

    });

};

// ---------------- LOAD BOOKS ----------------

async function loadBooks(page = 1) {

    currentPage = page;

    const res = await fetch(BOOK_API + "?page=" + page, {
        headers: headers
    });

    const data = await res.json();

    let html = "";

    data.results.forEach(book => {

        html += `
        <tr>
            <td>${book.id}</td>
            <td>${book.book_name}</td>
            <td>${book.author_name}</td>
            <td>${book.library ?? ""}</td>

            <td>

                <button class="btn btn-warning btn-sm"
                onclick="editBook(${book.id})">
                Edit
                </button>

                <button class="btn btn-danger btn-sm"
                onclick="deleteBook(${book.id})">
                Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("bookTable").innerHTML = html;

    pagination(data);

}

// ---------------- Pagination ----------------

function pagination(data){

    let html="";

    if(data.previous){

        html+=`
        <li class="page-item">
            <button class="page-link"
            onclick="loadBooks(${currentPage-1})">
            Previous
            </button>
        </li>`;
    }

    html+=`
    <li class="page-item active">
        <span class="page-link">${currentPage}</span>
    </li>`;

    if(data.next){

        html+=`
        <li class="page-item">
            <button class="page-link"
            onclick="loadBooks(${currentPage+1})">
            Next
            </button>
        </li>`;
    }

    document.getElementById("pagination").innerHTML=html;

}

// ---------------- LOAD LIBRARIES ----------------

async function loadLibraries(){

    const res = await fetch(LIBRARY_API,{
        headers:headers
    });

    const data = await res.json();

    let option = '<option value="">Select Library</option>';

    data.results.forEach(lib=>{

        option += `
        <option value="${lib.id}">
            ${lib.library_name}
        </option>
        `;

    });

    document.getElementById("library").innerHTML = option;

}

// ---------------- SAVE ----------------

async function saveBook(){

    const id=document.getElementById("bookId").value;

    const body={

        book_name:document.getElementById("book_name").value,

        author_name:document.getElementById("author_name").value,

        library:document.getElementById("library").value

    };

    if(id==""){

        const res=await fetch(BOOK_API,{

            method:"POST",

            headers:headers,

            body:JSON.stringify(body)

        });

        if(res.ok){

            alert("Book Added");

            bootstrap.Modal.getInstance(
            document.getElementById("bookModal")).hide();

            clearForm();

            loadBooks(currentPage);

        }

    }else{

        const res=await fetch(BOOK_API+id+"/",{

            method:"PUT",

            headers:headers,

            body:JSON.stringify(body)

        });

        if(res.ok){

            alert("Book Updated");

            bootstrap.Modal.getInstance(
            document.getElementById("bookModal")).hide();

            clearForm();

            loadBooks(currentPage);

        }

    }

}

// ---------------- EDIT ----------------

async function editBook(id){
    clearForm();

    const res = await fetch(BOOK_API+id+"/",{

        headers:headers

    });

    const book = await res.json();

    document.getElementById("bookId").value=book.id;

    document.getElementById("book_name").value=book.book_name;

    document.getElementById("author_name").value=book.author_name;

    document.getElementById("library").value=book.library;

    new bootstrap.Modal(
    document.getElementById("bookModal")).show();

}

// ---------------- DELETE ----------------

async function deleteBook(id){

    if(!confirm("Delete Book ?")) return;

    const res = await fetch(BOOK_API+id+"/",{

        method:"DELETE",

        headers:headers

    });

    if(res.ok){

        alert("Book Deleted");

        loadBooks(currentPage);

    }

}

// ---------------- CLEAR ----------------

function clearForm(){

    document.getElementById("bookId").value="";

    document.getElementById("book_name").value="";

    document.getElementById("author_name").value="";

    document.getElementById("library").value="";

}

// ---------------- SEARCH ----------------

document.getElementById("search").addEventListener("keyup",function(){

    let value=this.value.toLowerCase();

    document.querySelectorAll("#bookTable tr").forEach(row=>{

        row.style.display=row.innerText.toLowerCase().includes(value)
        ?"":"none";

    });

});


// _____csv upload____
async function uploadCSV() {

    const file = document.getElementById("csvFile").files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/library/book/upload-csv/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.json();

    if (res.ok) {

        alert(data.message);

        loadBooks(currentPage);

        document.getElementById("csvFile").value = "";

    } else {

        alert(data.error || "CSV Upload Failed");

    }
}