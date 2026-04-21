const adminStatus = document.getElementById("adminStatus");
const adminContent = document.getElementById("adminContent");
const logoutBtn = document.getElementById("logoutBtn");

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

checkAdminAccess();