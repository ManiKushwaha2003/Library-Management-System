const API = "/api/library/book/upload-csv/";
const token = localStorage.getItem("access");

const form = document.getElementById("uploadForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", uploadCSV);

async function uploadCSV(e){

    e.preventDefault();

    const file = document.getElementById("csvFile").files[0];

    if(!file){

        alert("Please Select CSV File");

        return;

    }

    const formData = new FormData();

    formData.append("file", file);

    try{

        const res = await fetch(API,{

            method:"POST",

            headers:{
                "Authorization":`Bearer ${token}`
            },

            body:formData

        });

        const data = await res.json();

        if(res.ok){

            msg.innerHTML=`

            <div class="alert alert-success">

                ${data.message}<br>

                Total Books : <b>${data.total_books}</b>

            </div>

            `;

            form.reset();

        }

        else{

            msg.innerHTML=`

            <div class="alert alert-danger">

                ${data.error || "Upload Failed"}

            </div>

            `;

        }

    }

    catch(error){

        console.log(error);

        msg.innerHTML=`

        <div class="alert alert-danger">

            Server Error

        </div>

        `;

    }

}