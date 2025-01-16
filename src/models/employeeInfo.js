const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    employeeCode: {
      type: String,
      required: true,
      unique: true
    },
    employeeName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    employeeDepartment: {
      type: String,
      required: true
    },
    managersName: {
      type: [String],
      required: true
    }
  }, {
    timestamps: true // Adds createdAt and updatedAt fields
  });
  

const employeeInfo = mongoose.model('employeeInfo', userSchema);

module.exports = {
  employeeInfo
}