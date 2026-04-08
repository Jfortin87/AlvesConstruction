//!   -------     JS/ comments.js      -------

//mt API endpoint
// const API_URL = process.env.COMM_URL;
const API_URL = "http://localhost:3000/api/comments";

//mt ⭐ STAR RATING SELECTORS
const stars = document.querySelectorAll("#starRating span");
const ratingInput = document.getElementById("jobRating");

//mt Helper function to render stars based on rating value (0-100)
function renderStars(rating) {
    const totalStars = 5;
    const filledStars = Math.round(rating / 20);

    let starsHTML = "";

    for (let i = 1; i <= totalStars; i++) {
        starsHTML += i <= filledStars ? "★" : "☆";
    }

    return starsHTML;
}

//mt (GET) Load comments (html/pages/comments.html, index.html)and display them
// Handle form submission/ Load/ Display comments
async function loadComments() {
    const res = await fetch(API_URL);
    const comments = await res.json();

    //st Update comment count in UI
    const countEl = document.getElementById("commentCount");

    // If count element exists, update.
    if (countEl) {
        countEl.textContent = `(${comments.length})`;
    }

    //st Rating Star Average
    const avgEl = document.getElementById("avgRating");

    // If avg element exists, calculate average rating and update UI. Otherwise, skip.
    if (avgEl) {
        if (comments.length) {
            const total = comments.reduce((sum, c) => sum + c.rating, 0);

            const avg = total / comments.length;
            avg.classList = "comms-AverageStarRating";

            avgEl.innerHTML = ` ${renderStars(avg)} (${(avg / 20).toFixed(1)})`;
        } else {
            avgEl.innerHTML = "☆☆☆☆☆ (0.0)";
        }
    }

    //! LOGGING
    // console.log("Loading comments:", comments);

    const container =
        document.getElementById("commentsContainer") || // RETURN- comments page
        document.getElementById("homeComments_Cont"); // RETURN- home page

    //mt If no container found, exit function
    if (!container) return;

    container.innerHTML = "";

    // Only show 10 on homepage
    const isHome = document.getElementById("homeComments_Cont") !== null;

    // If on homepage, show only first 10 comments, else show all
    const displayComments = isHome ? comments.slice(0, 10) : comments;

    //mt Create comment cards
    displayComments.forEach((c) => {
        const div = document.createElement("div");

        const token = localStorage.getItem(c.id);

        div.classList.add("comment-card");

        div.innerHTML = `
          <div style=
          "
          border: 1px solid #1e1e1e;
          border-radius: 5px;
          background: #1e1e1e;
          color: white;
          margin-bottom: 10px;
          padding: 3px;
          ">

          <h3 style=
          "
          padding-bottom: 5px;
          font-family: cursive;
          ">${c.name}</h3>

          <p style=
          "
          padding-bottom: 20px;
          font-family: arial;
          font-size: 14px;
          ">
          ${c.comment}
          </p>

          <div class="comment-rating"
          style=
          "
          margin: 0 0 5px 0;
          color: gold;

          "
          >
          ${renderStars(c.rating)} (${c.rating})<br />

            ${c.isCustomer ? "✔️ Customer" : "❌ Customer"}
          </div>

          <small style=
          "
          color: #585858;
          font-size: 10px;
          "
          >${new Date(c.createdAt).toLocaleString()}</small>

          </div>

          ${token && !isHome
                ? `
            <div class="comment-actions">

              <button onclick="startEdit('${c.id}', '${c.name}', \`${c.comment}\`, ${c.rating}, ${c.isCustomer})"
            style=
            "
            border: 1px solid #139b01;
            border-radius: 5px;
            background: #707070;
            color: #139b01;
            "
              >Edit</button>

              <button onclick="deleteComment('${c.id}')"
              style=
              "
              border: 1px solid #720202;
              border-radius: 5px;
              background: #707070;
              color: #720202;
              "
              >Delete</button>

            </div>
          `
                : ""
            }

        `;

        container.appendChild(div);
    });
}

// //mt SUBMIT FORM (POST)
const form = document.getElementById("commentsForm");

//! LOGGING
// if (form) {
//     console.log("Form Name:", form.name ? form.name.value : undefined);
//     console.log("Form Comment:", form.comment ? form.comment.value : undefined);
//     console.log("Form Rating:", form.jobRating ? form.jobRating.value : undefined);
//     console.log("Form IsCustomer:", form.isCustomer ? form.isCustomer.checked : undefined);
// }

//mt If form exists, add submit event listener
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            comment: document.getElementById("comment").value,
            rating: Number(document.getElementById("jobRating").value),
            isCustomer: document.getElementById("isCustomer").checked,
        };

        let res;

        // If editingId exists, we're editing an existing comment, otherwise we're creating a new one
        if (editingId) {
            const token = localStorage.getItem(editingId);

            res = await fetch(`${API_URL}/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    editToken: token,
                }),
            });

            editingId = null;
        } else {
            // For new comments, we also need to include the name
            const fullData = {
                name: document.getElementById("name").value,
                ...data,
            };

            res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fullData),
            });
        }

        const result = await res.json();

        //st If response is ok, save edit token (if provided), reset form, and reload comments. Otherwise, show error message
        if (res.ok) {
            if (result.editToken) {
                localStorage.setItem(result.id, result.editToken);
            }

            // reset form
            document.getElementById("commentsForm").reset();

            // reset stars UI
            // if (stars.length) {
            //     stars.forEach(s => s.classList.remove("active"));
            // }

            // reset rating value
            const ratingInput = document.getElementById("jobRating");
            if (ratingInput) {
                ratingInput.value = 100;
            }

            editingId = null;
            loadComments();
        } else {
            alert(result.error);
        }
    });
}

//mt -- START EDIT -- / UPDATE
let editingId = null;

function startEdit(id, name, comment, rating, isCustomer) {
    editingId = id;

    document.getElementById("name").value = name;
    document.getElementById("comment").value = comment;
    document.getElementById("jobRating").value = rating;
    document.getElementById("isCustomer").checked = isCustomer;

    document.getElementById("cancelEditBtn").style.display = "inline-block";

    // Change submit button text to "Update Comment"
    document.querySelector("#commentsForm button[type='submit']").textContent =
        "Update Comment";

    // ⭐ update stars visually (SAFE)
    if (stars.length) {
        stars.forEach((s) => {
            s.classList.toggle(
                "active",
                Number(s.getAttribute("data-value")) <= rating,
            );
        });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

//st CANCEL EDIT
const cancelBtn = document.getElementById("cancelEditBtn");

if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        editingId = null;

        // reset form
        document.getElementById("commentsForm").reset();

        // reset stars 100% filled
        if (stars.length) {
            stars.forEach((s) => s.classList.add("active"));
        }

        // reset rating
        const ratingInput = document.getElementById("jobRating");
        if (ratingInput) {
            ratingInput.value = 100;
        }

        // Change submit button text back to "Submit"
        document.querySelector("#commentsForm button[type='submit']").textContent =
            "Submit";

        // hide cancel button
        cancelBtn.style.display = "none";
    });
}

//mt DELETE
window.deleteComment = async (id) => {
    const token = localStorage.getItem(id);

    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ editToken: token }),
    });

    const result = await res.json();

    if (res.ok) {
        loadComments();
    } else {
        alert(result.error);
    }
};

//mt ⭐ STAR RATING LOGIC
//st ONLY run if BOTH exist (this fixes homepage crash)
if (stars.length && ratingInput) {
    stars.forEach((star) => {
        star.addEventListener("click", () => {
            const value = Number(star.getAttribute("data-value"));

            // set hidden input
            ratingInput.value = value;

            // highlight stars
            stars.forEach((s) => {
                s.classList.toggle(
                    "active",
                    Number(s.getAttribute("data-value")) <= value,
                );
            });
        });
    });

    //st ⭐ SAFE default highlight
    if (ratingInput.value) {
        const value = Number(ratingInput.value);

        stars.forEach((s) => {
            s.classList.toggle(
                "active",
                Number(s.getAttribute("data-value")) <= value,
            );
        });
    }
}

//mt LOAD
loadComments();
