//! DotENV setup
// import dotenv from "dotenv";
// dotenv.config();
// console.log(process.env)
// console.log("API URL:", process.env.COMM_URL);

//mt API endpoint
// const API_URL = process.env.COMM_URL;
const API_URL = "http://localhost:3000/api/comments";



//mt (GET) Load comments and display them
// Handle form submission
async function loadComments() {
    const res = await fetch(API_URL);
    const comments = await res.json();

    const container = document.getElementById("commentsContainer");
    container.innerHTML = "";


    comments.forEach((c) => {
        const div = document.createElement("div");

        const token = localStorage.getItem(c.id);

        div.classList.add("comment-card");

        div.innerHTML = `
          <h3>${c.name}</h3>
          <p>${c.comment}</p>

          <div>
            ⭐ Rating: <strong>${c.rating}</strong>
            ${c.isCustomer ? "✔️ Customer" : "❌ Not a customer"}
          </div>

          <small>${new Date(c.createdAt).toLocaleString()}</small>

          ${token
                ? `
            <div class="comment-actions">
              <button onclick="startEdit('${c.id}', \`${c.comment}\`, ${c.rating}, ${c.isCustomer})">Edit</button>
              <button onclick="deleteComment('${c.id}')">Delete</button>
            </div>
          `
                : ""
            }

          <hr/>
        `;

        container.appendChild(div);
    });
}

//mt SUBMIT FORM (POST)
document.getElementById("commentsForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        comment: document.getElementById("comment").value,
        rating: Number(document.getElementById("jobRating").value),
        isCustomer: document.getElementById("isCustomer").checked
    };

    let res;

    if (editingId) {
        // EDIT MODE
        const token = localStorage.getItem(editingId);

        res = await fetch(`${API_URL}/${editingId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                editToken: token
            })
        });

        editingId = null;

    } else {
        // CREATE MODE
        const fullData = {
            name: document.getElementById("name").value,
            ...data
        };

        res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fullData)
        });
    }

    const result = await res.json();

    //st CLEAR FORM FIRST, THEN RELOAD COMMENTS
    if (res.ok) {
        if (result.editToken) {
            localStorage.setItem(result.id, result.editToken);
        }

        // CLEAR FORM FIRST
        document.getElementById("commentsForm").reset();

        // CLEAR EDIT MODE
        editingId = null;

        // Reload comments AFTER reset
        loadComments();

    } else {
        alert(result.error);
    }

});

//mt EDIT/ UPDATE
let editingId = null;

function startEdit(id, comment, rating, isCustomer) {
    editingId = id;

    document.getElementById("comment").value = comment;
    document.getElementById("jobRating").value = rating;
    document.getElementById("isCustomer").checked = isCustomer;

    window.scrollTo({ top: 0, behavior: "smooth" });
}


//mt DELETE
window.deleteComment = async (id) => {
    const token = localStorage.getItem(id);

    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ editToken: token })
    });

    const result = await res.json();

    if (res.ok) {
        loadComments();
    } else {
        alert(result.error);
    }
}

//mt LOAD
loadComments();
