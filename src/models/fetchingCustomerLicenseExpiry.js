// const Customer = require('./customerModel');

// // Fetch all customers
// async function fetchCustomers() {
//     try {
//         return await Customer.find();
//     } catch (error) {
//         console.error("❌ Error fetching customers:", error);
//         return [];
//     }
// }

// // Insert a new customer
// async function addCustomer(customerData) {
//     try {
//         const newCustomer = new Customer(customerData);
//         return await newCustomer.save();
//     } catch (error) {
//         console.error("❌ Error adding customer:", error);
//     }
// }

// // Update customer details
// async function updateCustomer(id, updatedData) {
//     try {
//         return await Customer.findByIdAndUpdate(id, updatedData, { new: true });
//     } catch (error) {
//         console.error("❌ Error updating customer:", error);
//     }
// }

// // Delete a customer
// async function deleteCustomer(id) {
//     try {
//         return await Customer.findByIdAndDelete(id);
//     } catch (error) {
//         console.error("❌ Error deleting customer:", error);
//     }
// }

// module.exports = { fetchCustomers, addCustomer, updateCustomer, deleteCustomer };



const Customer = require('./customerLicense'); // Import Schema

// Function to fetch all customers from MongoDB
async function fetchCustomers() {
    try {
        return await Customer.find(); // Fetch all records
    } catch (error) {
        console.error("❌ Error fetching customers:", error);
        return []; // Return an empty array in case of error
    }
}

module.exports = {
    fetchCustomers
};
