const payTrackerStatus = document.getElementById("payTrackerStatus");
const payTrackerContent = document.getElementById("payTrackerContent");
const backToAdminBtn = document.getElementById("backToAdminBtn");
const createTableForm = document.getElementById("createTableForm");
const tableNameInput = document.getElementById("tableName");
const tablesContainer = document.getElementById("tablesContainer");

async function checkPayTrackerAccess() {
    try {
        const res = await fetch("http://127.0.0.1:3000/check-user", {
            method: "GET",
            credentials: "include"
        });

        const user = await res.json();

        console.log("PAY TRACKER USER:", user);

        if (!user || user.role !== "admin") {
            payTrackerStatus.textContent = "Access denied. Redirecting to login...";
            setTimeout(() => {
                window.location.href = "/html/pages/login.html";
            }, 1000);
            return;
        }

        payTrackerStatus.textContent = `Logged in as ${user.email}`;
        payTrackerContent.style.display = "block";

        await loadSavedTables();
    } catch (error) {
        console.error("PAY TRACKER ACCESS ERROR:", error);
        payTrackerStatus.textContent = "Error checking admin access.";
    }
}





function createDayBoxes() {
    let boxesHTML = "";

    for (let i = 1; i <= 20; i++) {
        boxesHTML += `
            <div class="dayBox" data-value="0" onclick="toggleDayBox(this)">
                <span class="boxLabel">${i}</span>
            </div>
        `;
    }

    return boxesHTML;
}

//
function createStarterRows() {
    let rowsHTML = "";

    for (let i = 0; i < 5; i++) {
        rowsHTML += `
            <tr>
                <td><input type="text" class="workerName" placeholder="Worker name"></td>
                <td><input type="number" class="dailyPay" placeholder="Daily pay" min="0" step="0.01"></td>
                <td>
                    <div class="dayBoxesRow">
                        ${createDayBoxes()}
                    </div>
                </td>
                <td class="totalDays">0</td>
                <td class="cashTotal">0.00</td>
            </tr>
        `;
    }

    return rowsHTML;
}

//mt  - updateTablePayrollTotal -: Calculate and update the total payout for a given table based on its cash total cells
function updateTablePayrollTotal(tableWrapper) {
    const cashTotalCells = tableWrapper.querySelectorAll(".cashTotal");
    const totalValueEl = tableWrapper.querySelector(".tableTotalValue");

    let totalPayout = 0;

    cashTotalCells.forEach(cell => {
        totalPayout += Number(cell.textContent) || 0;
    });

    totalValueEl.textContent = totalPayout.toFixed(2);
}

//mt - formatCreatedDate -: Format a date string into a more readable format for display in the UI
function formatCreatedDate(dateString) {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

//mt Create a pay table element based on the provided table data
async function createPayTable(table) {
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "payTableWrapper";
    tableWrapper.dataset.tableId = table.id;

    tableWrapper.innerHTML = `
    <div class="payTableHeader">
    <div class="payTableTitleArea">
        <h3>${table.tableName}</h3>
        <p class="tablePayrollTotal">
            Workers Payout: $<span class="tableTotalValue">0.00</span>
        </p>

        <p class="tableCreatedDate">
        Created: ${formatCreatedDate(table.createdAt)}
    </p>
    </div>

    <div>
        <button class="saveRowsBtn">Save Rows</button>
        <button class="addRowBtn">Add Row</button>
        <button class="deleteTableBtn">Delete Table</button>
    </div>
</div>


        <div class="tableScroll">
            <table class="payTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Daily Pay</th>
                        <th>Days</th>
                        <th>Total (Days)</th>
                        <th>Cash Total</th>
                        <th>Actions</th>


                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;

    const addRowBtn = tableWrapper.querySelector(".addRowBtn");
    const saveRowsBtn = tableWrapper.querySelector(".saveRowsBtn");
    const tbody = tableWrapper.querySelector("tbody");
    const deleteTableBtn = tableWrapper.querySelector(".deleteTableBtn");

    async function loadRows() {
        try {
            const res = await fetch(`http://127.0.0.1:3000/api/pay-tracker/tables/${table.id}/rows`, {
                method: "GET",
                credentials: "include"
            });

            const rows = await res.json();
            console.log(`ROWS FOR TABLE ${table.tableName}:`, rows);

            tbody.innerHTML = "";

            if (!rows.length) {
                for (let i = 0; i < 5; i++) {
                    const newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td><input type="text" class="workerName" placeholder="Worker name"></td>
                        <td><input type="number" class="dailyPay" placeholder="Daily pay" min="0" step="0.01"></td>
                        <td>
                            <div class="dayBoxesRow">
                                ${createDayBoxes()}
                            </div>
                        </td>
                        <td class="totalDays">0</td>
                        <td class="cashTotal">0.00</td>
                        <td>
                        <button type="button" class="deleteRowBtn" onclick="deletePayRow(this)">Delete Row</button>
                        </td>
                    `;
                    tbody.appendChild(newRow);
                }
                updateTablePayrollTotal(tableWrapper);

                return;
            }

            rows.forEach(row => {
                const newRow = document.createElement("tr");

                let parsedDayValues = [];
                try {
                    parsedDayValues = JSON.parse(row.dayValues || "[]");
                } catch {
                    parsedDayValues = [];
                }

                let boxesHTML = "";
                for (let i = 0; i < 20; i++) {
                    const value = Number(parsedDayValues[i] || 0);

                    let boxClass = "";
                    if (value === 0.5) boxClass = "halfDay";
                    if (value === 1) boxClass = "fullDay";

                    boxesHTML += `
                        <div class="dayBox ${boxClass}" data-value="${value}" onclick="toggleDayBox(this)">
                            <span class="boxLabel">${i + 1}</span>
                        </div>
                    `;
                }

                newRow.innerHTML = `
                    <td><input type="text" class="workerName" placeholder="Worker name" value="${row.workerName || ""}"></td>
                    <td><input type="number" class="dailyPay" placeholder="Daily pay" min="0" step="0.01" value="${row.dailyPay || 0}"></td>
                    <td>
                        <div class="dayBoxesRow">
                            ${boxesHTML}
                        </div>
                    </td>
                    <td class="totalDays">${row.totalDays || 0}</td>
                    <td class="cashTotal">${Number(row.cashTotal || 0).toFixed(2)}</td>
                    <td>
                        <button type="button" class="deleteRowBtn" onclick="deletePayRow(this)">Delete Row</button>
                        </td>
                `;

                tbody.appendChild(newRow);
            });
            updateTablePayrollTotal(tableWrapper);

        } catch (error) {
            console.error("LOAD TABLE ROWS ERROR:", error);
        }
    }

    addRowBtn.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" class="workerName" placeholder="Worker name"></td>
            <td><input type="number" class="dailyPay" placeholder="Daily pay" min="0" step="0.01"></td>
            <td>
                <div class="dayBoxesRow">
                    ${createDayBoxes()}
                </div>
            </td>
            <td class="totalDays">0</td>
            <td class="cashTotal">0.00</td>
            <td>
                        <button type="button" class="deleteRowBtn" onclick="deletePayRow(this)">Delete Row</button>
                        </td>
        `;

        tbody.appendChild(newRow);
    });

    saveRowsBtn.addEventListener("click", async () => {
        try {
            const rowElements = tbody.querySelectorAll("tr");

            const rows = Array.from(rowElements).map(row => {
                const workerName = row.querySelector(".workerName")?.value.trim() || "";
                const dailyPay = Number(row.querySelector(".dailyPay")?.value) || 0;
                const totalDays = Number(row.querySelector(".totalDays")?.textContent) || 0;
                const cashTotal = Number(row.querySelector(".cashTotal")?.textContent) || 0;

                const dayBoxes = row.querySelectorAll(".dayBox");
                const dayValues = Array.from(dayBoxes).map(box => Number(box.dataset.value || 0));

                return {
                    workerName,
                    dailyPay,
                    dayValues,
                    totalDays,
                    cashTotal
                };
            });

            const res = await fetch(`http://127.0.0.1:3000/api/pay-tracker/tables/${table.id}/rows`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ rows })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to save rows");
                return;
            }

            alert("Rows saved successfully");
            await loadRows();
        } catch (error) {
            console.error("SAVE ROWS ERROR:", error);
            alert("Failed to save rows");
        }
    });

    deleteTableBtn.addEventListener("click", async () => {
        const confirmed = confirm(`Delete table "${table.tableName}"?`);

        if (!confirmed) return;

        try {
            const res = await fetch(`http://127.0.0.1:3000/api/pay-tracker/tables/${table.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to delete table");
                return;
            }

            tableWrapper.remove();
        } catch (error) {
            console.error("DELETE TABLE ERROR:", error);
            alert("Failed to delete table");
        }
    });

    tablesContainer.prepend(tableWrapper);
    await loadRows();
}

function toggleDayBox(box) {
    const currentValue = Number(box.dataset.value);

    if (currentValue === 0) {
        box.dataset.value = "0.5";
        box.classList.add("halfDay");
        box.classList.remove("fullDay");
    } else if (currentValue === 0.5) {
        box.dataset.value = "1";
        box.classList.add("fullDay");
        box.classList.remove("halfDay");
    } else {
        box.dataset.value = "0";
        box.classList.remove("halfDay", "fullDay");
    }

    updateRowTotals(box);
}

//mt - updateRowTotals -: Calculate and update the total days and cash total for a given row based on its day boxes and daily pay input
function updateRowTotals(box) {
    const row = box.closest("tr");
    const allBoxes = row.querySelectorAll(".dayBox");
    const dailyPayInput = row.querySelector(".dailyPay");
    const totalDaysCell = row.querySelector(".totalDays");
    const cashTotalCell = row.querySelector(".cashTotal");

    let totalDays = 0;

    allBoxes.forEach(dayBox => {
        totalDays += Number(dayBox.dataset.value);
    });

    const dailyPay = Number(dailyPayInput.value) || 0;
    const cashTotal = totalDays * dailyPay;

    totalDaysCell.textContent = totalDays;
    cashTotalCell.textContent = cashTotal.toFixed(2);

    const tableWrapper = row.closest(".payTableWrapper");
    if (tableWrapper) {
        updateTablePayrollTotal(tableWrapper);
    }
}


//mt - loadSavedTables -: Fetches saved pay tables from the server and creates table elements for each one
async function loadSavedTables() {
    try {
        const res = await fetch("http://127.0.0.1:3000/api/pay-tracker/tables", {
            method: "GET",
            credentials: "include"
        });

        const tables = await res.json();
        console.log("SAVED PAY TABLES:", tables);

        if (!res.ok) {
            console.error("Failed to load saved tables");
            return;
        }

        tablesContainer.innerHTML = "";

        for (const table of tables) {
            await createPayTable(table);
        }

    } catch (error) {
        console.error("LOAD SAVED TABLES ERROR:", error);
    }
}

//mt Delete row function (client-side only, requires save to persist)
function deletePayRow(button) {
    const row = button.closest("tr");
    if (!row) return;

    row.remove();
}


//!  -------     Event Listeners      -------


backToAdminBtn.addEventListener("click", () => {
    window.location.href = "/html/dashboard/dashboard.html";
});

document.addEventListener("input", (e) => {
    if (e.target.classList.contains("dailyPay")) {
        const row = e.target.closest("tr");
        const firstBox = row.querySelector(".dayBox");

        if (firstBox) {
            updateRowTotals(firstBox);
        }
    }
});

createTableForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tableName = tableNameInput.value.trim();

    if (!tableName) {
        alert("Please enter a table name.");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:3000/api/pay-tracker/tables", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ tableName })
        });

        const data = await res.json();
        console.log("CREATE PAY TABLE RESPONSE:", data);

        if (!res.ok) {
            alert(data.error || "Failed to create pay table");
            return;
        }

        tableNameInput.value = "";
        await loadSavedTables();


    } catch (error) {
        console.error("CREATE PAY TABLE ERROR:", error);
        alert("Error creating pay table");
    }
});




//mt Expose functions to global scope for inline event handlers
window.toggleDayBox = toggleDayBox;

window.deletePayRow = deletePayRow;

checkPayTrackerAccess();