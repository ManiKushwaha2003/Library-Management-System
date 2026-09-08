
let token = localStorage.getItem("access");

if (!token) {
    window.location.href = "/login/";
}

fetch("/api/library/libraries/", {
    headers: {
        "Authorization": "Bearer " + token
    }
})
.then(res => res.json())
.then(data => {

    let libraries = data.results || data;

    let html = "";

    libraries.forEach(function(library) {

        html += `
            <div class="col-md-4 mb-3">

                <div class="card shadow-sm">

                    <div class="card-body">

                        <h5>
                            ${library.library_name}
                        </h5>

                        <a
                            href="/library-books/${library.id}/"
                            class="btn btn-primary">
                            View Books
                        </a>

                    </div>

                </div>

            </div>
        `;

    });

    document.getElementById("libraryList").innerHTML = html;
});

