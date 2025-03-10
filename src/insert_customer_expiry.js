const mongoose = require('mongoose');
const Customer = require('./models/customerLicense'); // Import the model 

// const MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority";
const MONGO_URI = "mongodb+srv://rupeshsc1999:TzIKfPk2AHpbMl78@mycluster.imcex5u.mongodb.net/?retryWrites=true&w=majority&appName=myCluster";

const jsonData = [
    {
      "srNo": 1,
      "customerName": "Indoco",
      "description": "BOT-Intellegent Automation",
      "startDate": "2023-12-20T00:00:00.000",
      "expiryDate": "2024-12-19T00:00:00.000"
    },
    {
      "srNo": 2,
      "customerName": "Mankind Pharma Limited",
      "description": "Software Licence Fees",
      "startDate": "2023-12-19T00:00:00.000",
      "expiryDate": "2024-12-18T00:00:00.000"
    },
    {
      "srNo": 3,
      "customerName": "Mankind Pharma Limited",
      "description": "AMC",
      "startDate": null,
      "expiryDate": null
    },
    {
      "srNo": 4,
      "customerName": "Lohia Corp Limited",
      "description": "RPA Licenses Subscription",
      "startDate": "2025-12-23T00:00:00.000",
      "expiryDate": "2025-12-24T00:00:00.000"
    },
    {
      "srNo": 5,
      "customerName": "TP Solapur Limited",
      "description": "License Cost",
      "startDate": "2023-12-01T00:00:00.000",
      "expiryDate": "2024-11-30T00:00:00.000"
    },
    {
      "srNo": 6,
      "customerName": "Hero Moto Corp",
      "description": "BOT Console",
      "startDate": "2024-04-01T00:00:00.000",
      "expiryDate": "2025-03-31T00:00:00.000"
    },
    {
      "srNo": 7,
      "customerName": "Hero Moto Corp",
      "description": "BOT",
      "startDate": "2024-04-01T00:00:00.000",
      "expiryDate": "2025-03-31T00:00:00.000"
    },
    {
      "srNo": 8,
      "customerName": "Hero Moto Corp",
      "description": "Barcode scanning sdk software",
      "startDate": "2024-04-01T00:00:00.000",
      "expiryDate": "2025-03-31T00:00:00.000"
    },
    {
      "srNo": 9,
      "customerName": "EIH Limited",
      "description": "BOT/Agent",
      "startDate": "2025-04-24T00:00:00.000",
      "expiryDate": "2025-03-25T00:00:00.000"
    },
    {
      "srNo": 10,
      "customerName": "EIH Limited",
      "description": "Console",
      "startDate": "2025-04-24T00:00:00.000",
      "expiryDate": "2025-03-25T00:00:00.000"
    },
    {
      "srNo": 11,
      "customerName": "Shahi Exports",
      "description": "BOT",
      "startDate": "2024-08-01T00:00:00.000",
      "expiryDate": "2025-07-31T00:00:00.000"
    },
    {
      "srNo": 12,
      "customerName": "Adani Electricity",
      "description": "AMC - Intelligent BOT Solution Software",
      "startDate": "2025-01-24T00:00:00.000",
      "expiryDate": "2025-12-24T00:00:00.000"
    },
    {
      "srNo": 13,
      "customerName": "Pon Pure Chemical India Private Limited",
      "description": "RPA Platform and BOT",
      "startDate": "2023-12-21T00:00:00.000",
      "expiryDate": "2024-12-21T00:00:00.000"
    },
    {
      "srNo": 14,
      "customerName": "IFB Industries Limited",
      "description": "RPA Base",
      "startDate": "2023-10-22T00:00:00.000",
      "expiryDate": "2024-10-21T00:00:00.000"
    },
    {
      "srNo": 15,
      "customerName": "Manappuram Finance Limited",
      "description": "BIONIC RPA COMPONENTS",
      "startDate": "2024-08-01T00:00:00.000",
      "expiryDate": "2025-07-31T00:00:00.000"
    },
    {
      "srNo": 16,
      "customerName": "Rockman Industries Limited",
      "description": "Platform Fees",
      "startDate": "2025-06-24T00:00:00.000",
      "expiryDate": "2025-06-25T00:00:00.000"
    },
    {
      "srNo": 17,
      "customerName": "Summit Digital Infrastructure",
      "description": "Web scrapping Agent Charges",
      "startDate": "2024-03-16T00:00:00.000",
      "expiryDate": "2025-03-15T00:00:00.000"
    }
];

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log("MongoDB Connected...");
//         return Customer.insertMany(jsonData.map(item => ({
//             srNo: item["srNo"],
//             customerName: item["customerName"],
//             description: item["description"],
//             startDate: item["startDate"] ? new Date(item["startDate"]) : null,
//             expiryDate: item["expiryDate"] ? new Date(item["expiryDate"]) : null
//         })));
//     })
//     .then(() => {
//         console.log("Data Inserted Successfully!");
//         mongoose.connection.close();
//     })
//     .catch(err => console.error("Error:", err));
