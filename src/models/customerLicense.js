// const mongoose = require('mongoose');

// const customerSchema = new mongoose.Schema({
//     srNo: { type: Number },
//     customerName: { type: String, required: true },
//     description: { type: String, required: true },
//     startDate: { type: Date },
//     expiryDate: { type: Date }
// });

// const Customer = mongoose.model("Customer", customerSchema);

// module.exports = Customer;



const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    srNo: { type: Number, unique: true }, // Optional: Make unique if needed
    customerName: { type: String, required: true, trim: true }, // ✅ Trim to remove extra spaces
    description: { type: String, required: true, trim: true }, 
    startDate: { type: Date, default: null }, // ✅ Set default to null for consistency
    expiryDate: { type: Date, default: null } 
}, { timestamps: true }); // ✅ Adds createdAt & updatedAt automatically

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
