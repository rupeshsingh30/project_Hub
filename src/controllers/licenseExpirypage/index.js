const { resolvePath, renderPage } = require('../utils.js'); // ✅ Ensure this is correct
const { fetchCustomers } = require('../../models/fetchingCustomerLicenseExpiry.js');
const Customer = require('../../models/customerLicense.js')

async function getLicenseExpiryPage(req, res) {
    try {
        
        renderPage(res, resolvePath('licenseExpiryPage', 'licenseExpiryHome.ejs'), {
            empCode: req.cookies.empCode
        });

    } catch (error) {
        console.error("❌ Error rendering page:", error);
        res.status(500).send("Internal Server Error");
    }
}


async function getLicenseExpiryData(req, res) {
    try {
        // console.log('📌 Fetching license expiry customer data from MongoDB...');
        const customers = await fetchCustomers(); // ✅ Fetch data from MongoDB

        // console.log("📌 Fetched License Expiry Data:", customers);
        res.json({ success: true, data: customers || [] }); // ✅ Return JSON Response
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


// // ✅ Function to Update License by Customer Name (NEW)
// async function updateLicenseByCustomerName(req, res) {
//     try {
//         const { customerName, startDate, expiryDate } = req.body;

//         // ✅ Validate request
//         if (!customerName || !startDate || !expiryDate) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }

//         // ✅ Find and update the document
//         // const updatedLicense = await License.findOneAndUpdate(
//         const updatedLicense = await Customer.findOneAndUpdate(
//             { customerName }, // Search by customer name
//             { startDate, expiryDate }, // Update fields
//             { new: true } // Return updated document
//         );
//         console.log('updated license :',updatedLicense)
//         if (!updatedLicense) {
//             return res.status(404).json({ success: false, message: "License not found" });
//         }

//         res.json({ success: true, message: "License updated successfully", data: updatedLicense });
//     } catch (error) {
//         console.error("❌ Error updating license:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };



async function updateLicenseByCustomerName(req, res) {
    try {
        const { customerName, startDate, expiryDate } = req.body;

        // ✅ Validate request data
        if (!customerName || !startDate || !expiryDate) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // ✅ Convert date strings to Date objects
        const formattedStartDate = new Date(startDate);
        const formattedExpiryDate = new Date(expiryDate);

        // ✅ Check if customer exists before updating
        const existingCustomer = await Customer.findOne({ customerName });
        
        
        if (!existingCustomer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        // ✅ Update customer data
        existingCustomer.startDate = formattedStartDate;
        existingCustomer.expiryDate = formattedExpiryDate;
        await existingCustomer.save();

        res.json({ success: true, message: "License updated successfully", data: existingCustomer });
    } catch (error) {
        console.error("❌ Error updating license:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

// module.exports = { updateLicenseByCustomerName };


module.exports ={
    getLicenseExpiryData,
    getLicenseExpiryPage,
    updateLicenseByCustomerName
}

