const API = "/api/library/libraries/";
const token = localStorage.getItem("access");

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

let currentPage = 1;

window.onload = function () {

    loadLibraries();

    document.getElementById("libraryModal").addEventListener("hidden.bs.modal", function () {

        clearForm();

    });

};

// ---------------- GET ----------------

async function loadLibraries(page = 1) {

    currentPage = page;

    const res = await fetch(API + "?page=" + page, {
        headers: headers
    });

    const data = await res.json();

    let html = "";

    data.results.forEach(library => {

        html += `
        <tr>

            <td>${library.id}</td>

            <td>${library.library_name}</td>

            <td>

                <button class="btn btn-warning btn-sm"
                    onclick="editLibrary(${library.id})">
                    Edit
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="deleteLibrary(${library.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("libraryTable").innerHTML = html;

    pagination(data);

}

// ---------------- Pagination ----------------

function pagination(data) {

    let html = "";

    if (data.previous) {

        html += `
        <li class="page-item">
            <button class="page-link"
            onclick="loadLibraries(${currentPage - 1})">
            Previous
            </button>
        </li>
        `;

    }

    html += `
    <li class="page-item active">
        <span class="page-link">${currentPage}</span>
    </li>
    `;

    if (data.next) {

        html += `
        <li class="page-item">
            <button class="page-link"
            onclick="loadLibraries(${currentPage + 1})">
            Next
            </button>
        </li>
        `;

    }

    document.getElementById("pagination").innerHTML = html;

}

// ---------------- Save ----------------

async function saveLibrary() {

    const id = document.getElementById("libraryId").value;

    const body = {

        library_name: document.getElementById("library_name").value.trim()

    };

    if (body.library_name === "") {

        alert("Library Name Required");

        return;

    }

    if (id == "") {

        const res = await fetch(API, {

            method: "POST",

            headers: headers,

            body: JSON.stringify(body)

        });

        if (res.ok) {

            alert("Library Added");

            bootstrap.Modal.getInstance(
                document.getElementById("libraryModal")
            ).hide();

            clearForm();

            loadLibraries(currentPage);

        }

    } else {

        const res = await fetch(API + id + "/", {

            method: "PUT",

            headers: headers,

            body: JSON.stringify(body)

        });

        if (res.ok) {

            alert("Library Updated");

            bootstrap.Modal.getInstance(
                document.getElementById("libraryModal")
            ).hide();

            clearForm();

            loadLibraries(currentPage);

        }

    }

}

// ---------------- Edit ----------------

async function editLibrary(id) {
    clearForm();

    const res = await fetch(API + id + "/", {

        headers: headers

    });

    const data = await res.json();

    document.getElementById("libraryId").value = data.id;

    document.getElementById("library_name").value = data.library_name;

    new bootstrap.Modal(
        document.getElementById("libraryModal")
    ).show();

}

// ---------------- Delete ----------------

async function deleteLibrary(id) {

    if (!confirm("Delete this library?")) return;

    const res = await fetch(API + id + "/", {

        method: "DELETE",

        headers: headers

    });

    if (res.ok) {

        alert("Library Deleted");

        loadLibraries(currentPage);

    }

}

// ---------------- Clear ----------------

function clearForm() {

    document.getElementById("libraryId").value = "";

    document.getElementById("library_name").value = "";

}

// ---------------- Search ----------------

document.getElementById("search").addEventListener("keyup", function () {

    let value = this.value.toLowerCase();

    let rows = document.querySelectorAll("#libraryTable tr");

    rows.forEach(row => {

        row.style.display = row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";

    });

});