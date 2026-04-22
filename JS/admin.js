const adminStatus = document.getElementById("adminStatus");
const adminContent = document.getElementById("adminContent");
const logoutBtn = document.getElementById("logoutBtn");
const loadCommentsBtn = document.getElementById("loadCommentsBtn");
const commentsContainer = document.getElementById("commentsContainer");

//mt Stats elements (for future use)
const loadStatsBtn = document.getElementById("loadStatsBtn");
const statsContainer = document.getElementById("statsContainer");

//mt Pay Tracker button (Pay tracker feature
const payTrackerBtn = document.getElementById("payTrackerBtn");


//mt   Check Admin Access (no token, just check if user is admin on backend)
async function checkAdminAccess() {
    try {
        const res = await fetch("http://127.0.0.1:3000/check-user", {
            method: "GET",
            credentials: "include"
        });

        const user = await res.json();

        console.log("ADMIN PAGE USER:", user);

        if (!user || user.role !== "admin") {
            adminStatus.textContent = "Access denied. Redirecting to login...";
            setTimeout(() => {
                window.location.href = "/html/pages/login.html";
            }, 1000);
            return;
        }

        adminStatus.textContent = `Logged in as ${user.email}`;
        adminContent.style.display = "block";
    } catch (error) {
        console.error("ADMIN PAGE ERROR:", error);
        adminStatus.textContent = "Error checking admin access.";
    }
}



//mt   Load Comments (GET ALL, no token, just admin check on backend)
async function loadComments() {
    if (commentsContainer.innerHTML.trim() !== "") {
        commentsContainer.innerHTML = "";
        loadCommentsBtn.textContent = "Load Comments";
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:3000/api/comments", {
            method: "GET",
            credentials: "include"
        });

        const comments = await res.json();

        console.log("ADMIN COMMENTS:", comments);

        if (!comments.length) {
            commentsContainer.innerHTML = "<p>No comments found.</p>";
            loadCommentsBtn.textContent = "Hide Comments";
            return;
        }

        commentsContainer.innerHTML = comments.map(comment => `
            <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
                <p><strong>Name:</strong> ${comment.name}</p>
                <p><strong>Comment:</strong> ${comment.comment}</p>
                <p><strong>Rating:</strong> ${comment.rating}</p>
                <p><strong>Customer:</strong> ${comment.isCustomer ? "Yes" : "No"}</p>
                <p><strong>Date:</strong> ${comment.createdAt || "No date"}</p>

                <button onclick="toggleEditForm('${comment.id}')">Edit</button>
                <button onclick="deleteComment('${comment.id}')">Delete</button>

                <div id="editForm-${comment.id}" style="display:none; margin-top:10px;">
                    <textarea id="editComment-${comment.id}" rows="4" style="width:100%;">${comment.comment}</textarea>

                    <label>
                        Rating:
                        <input type="number" id="editRating-${comment.id}" min="1" max="100" value="${comment.rating}">
                    </label>

                    <label>
                        Customer:
                        <select id="editCustomer-${comment.id}">
                            <option value="1" ${comment.isCustomer ? "selected" : ""}>Yes</option>
                            <option value="0" ${!comment.isCustomer ? "selected" : ""}>No</option>
                        </select>
                    </label>

                    <br><br>
                    <button onclick="saveCommentEdit('${comment.id}')">Save</button>
                    <button onclick="toggleEditForm('${comment.id}')">Cancel</button>
                </div>
            </div>
        `).join("");

        loadCommentsBtn.textContent = "Hide Comments";
    } catch (error) {
        console.error("LOAD COMMENTS ERROR:", error);
        commentsContainer.innerHTML = "<p>Failed to load comments.</p>";
        loadCommentsBtn.textContent = "Load Comments";
    }
}

//mt   Edit Comment (no token, just admin check on backend)
function toggleEditForm(id) {
    const form = document.getElementById(`editForm-${id}`);

    if (!form) return;

    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}

//mt   Save Comment Edit (no token, just admin check on backend)
async function saveCommentEdit(id) {
    const commentInput = document.getElementById(`editComment-${id}`);
    const ratingInput = document.getElementById(`editRating-${id}`);
    const customerInput = document.getElementById(`editCustomer-${id}`);

    const updatedComment = commentInput.value.trim();
    const updatedRating = Number(ratingInput.value);
    const updatedIsCustomer = customerInput.value === "1";

    if (!updatedComment || Number.isNaN(updatedRating)) {
        alert("Comment and rating are required.");
        return;
    }

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/comments/admin/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                comment: updatedComment,
                rating: updatedRating,
                isCustomer: updatedIsCustomer
            })
        });

        const data = await res.json();
        console.log("ADMIN EDIT RESPONSE:", data);

        if (!res.ok) {
            alert(data.error || "Failed to update comment");
            return;
        }

        alert("Comment updated successfully");
        loadComments();
    } catch (error) {
        console.error("ADMIN EDIT ERROR:", error);
        alert("Error updating comment");
    }
}

//mt   Delete Comment (no token, just admin check on backend)
async function deleteComment(id) {
    const confirmed = confirm("Are you sure you want to delete this comment?");

    if (!confirmed) return;

    try {
        const res = await fetch(`http://127.0.0.1:3000/api/comments/admin/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await res.json();
        console.log("DELETE RESPONSE:", data);

        if (!res.ok) {
            alert(data.message || "Failed to delete comment");
            return;
        }

        alert("Comment deleted successfully");
        loadComments();
    } catch (error) {
        console.error("DELETE COMMENT ERROR:", error);
        alert("Error deleting comment");
    }
}

//mt  Load Stats (GET stats, no token, just admin check on backend)
async function loadStats() {
    if (statsContainer.innerHTML.trim() !== "") {
        statsContainer.innerHTML = "";
        loadStatsBtn.textContent = "Show Stats";
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:3000/api/comments/admin/stats", {
            method: "GET",
            credentials: "include"
        });

        const stats = await res.json();

        if (!res.ok) {
            statsContainer.innerHTML = `<p>${stats.error || "Failed to load stats."}</p>`;
            loadStatsBtn.textContent = "Show Stats";
            return;
        }

        statsContainer.innerHTML = `
        <div class="statCard">
            <h3>Total Comments</h3>
            <p>${stats.totalComments}</p>
        </div>

        <div class="statCard">
            <h3>Average Rating</h3>
            <p>${stats.averageRating}</p>
        </div>

        <div class="statCard">
            <h3>Customers</h3>
            <p>${stats.customers}</p>
        </div>

        <div class="statCard">
            <h3>Non-Customers</h3>
            <p>${stats.nonCustomers}</p>
        </div>

        <div class="statCard">
            <h3>Latest Comment</h3>
            <p>${stats.latestComment ? stats.latestComment : "None"}</p>
        </div>
    `;

        loadStatsBtn.textContent = "Hide Stats";
    } catch (error) {
        console.error("LOAD STATS ERROR:", error);
        statsContainer.innerHTML = "<p>Failed to load stats.</p>";
        loadStatsBtn.textContent = "Show Stats";
    }
}
//mt    Logout (no token, just clear cookie and redirect)
logoutBtn.addEventListener("click", async () => {
    try {
        const res = await fetch("http://127.0.0.1:3000/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            window.location.href = "/html/pages/login.html";
        } else {
            alert("Logout failed");
        }
    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        alert("Logout request failed");
    }
});




//!       ------ EVENT LISTENERS ------
//mt    Load Comments and Stats on button click
loadStatsBtn.addEventListener("click", loadStats);
loadCommentsBtn.addEventListener("click", loadComments);

//mt Pay Tracker button click (redirect)
payTrackerBtn.addEventListener("click", () => {
    window.location.href = "/html/dashboard/payTracker.html";
});

//mt Expose functions to global scope for inline event handlers
window.deleteComment = deleteComment;
window.toggleEditForm = toggleEditForm;
window.saveCommentEdit = saveCommentEdit;


//mt Initial check for admin access
checkAdminAccess();