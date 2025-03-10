
// ✅ Function to Fetch License Expiry Data
async function fetchLicenseData() {
    // console.log("📌 Fetching license expiry data...");

    try {
        const response = await fetch("/license/license-api");
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return [];
    }
}

// ✅ Function to Update Table (Now Uses Customer Name)
function updateTable(data) {
    const tableBody = document.getElementById("table-body");
    if (!tableBody) {
        console.warn("⚠️ 'table-body' not found. Skipping table update.");
        return;
    }

    tableBody.innerHTML = ""; // Clear existing data

    // <td>${new Date(row.startDate).toLocaleDateString()}</td>
    // <td>${new Date(row.expiryDate).toLocaleDateString()}</td>
    data.forEach((row, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.customerName}</td> <!-- ✅ Customer Name Now Used -->
            <td>${row.description}</td>
            <td>${new Date(row.startDate).toISOString().split("T")[0]}</td>
            <td>${new Date(row.expiryDate).toISOString().split("T")[0]}</td>

            <td>
                <button class="btn btn-primary update-btn" 
                    data-customername="${row.customerName}" 
                    data-startdate="${row.startDate}" 
                    data-expirydate="${row.expiryDate}">
                    Update
                </button>
            </td>
        `;

        tableBody.appendChild(tr);
    });
}

// ✅ Function to Handle Update (Now Uses Customer Name)
async function handleUpdate(event) {
    const button = event.target;
    if (!button.classList.contains("update-btn")) return;

    const customerName = button.getAttribute("data-customername"); // ✅ Now Uses Customer Name
    const currentStartDate = new Date(button.getAttribute("data-startdate")).toISOString().split("T")[0];
    const currentExpiryDate = new Date(button.getAttribute("data-expirydate")).toISOString().split("T")[0];

    const newStartDate = prompt(`Enter new Start Date for ${customerName} (YYYY-MM-DD):`, currentStartDate);
    const newExpiryDate = prompt(`Enter new Expiry Date for ${customerName} (YYYY-MM-DD):`, currentExpiryDate);

    if (!newStartDate || !newExpiryDate) {
        alert("❌ Update cancelled. Both dates are required.");
        return;
    }

    console.log('customer name :',customerName,newStartDate,newExpiryDate)

    try {
        const response = await fetch(`/license/license-update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerName: customerName, // ✅ Now sending customer name
                startDate: newStartDate,
                expiryDate: newExpiryDate
            }),
        });

        const result = await response.json();

        if (result.success) {
            alert(`✅ License updated successfully for ${customerName}!`);
            location.reload();
        } else {
            alert(`❌ Failed to update license for ${customerName}.`);
        }
    } catch (error) {
        console.error(`❌ Error updating license for ${customerName}:`, error);
        alert("❌ An error occurred while updating.");
    }
}

// ✅ Initialize Event Listeners
function initializeEventListeners() {
    // console.log("📌 Initializing event listeners...");

    const tableBody = document.getElementById("table-body");
    if (!tableBody) return;

    tableBody.addEventListener("click", handleUpdate); // Attach update event listener

    fetchLicenseData().then(updateTable); // Fetch data and update table
}

// ✅ Attach event listeners when the document is ready
document.addEventListener("DOMContentLoaded", initializeEventListeners);

// ✅ Export functions only if using Node.js (CommonJS)
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        fetchLicenseData,
        updateTable,
        handleUpdate,
        initializeEventListeners,
    };
}
