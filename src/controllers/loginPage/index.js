const path = require('path');
const {employeeInfo} = require('../../models/employeeInfo');

async function getLoginPage(req , res){
    res.render(path.join(__dirname, '../../public/views/loginPage', 'loginPage.ejs'))
}

async function verifyLogin(req, res) {
    let email, password, empRole, empCode, emp;

    // Check if necessary information is present in cookies
    if (req.cookies.emailID && req.cookies.password && req.cookies.empRole && req.cookies.empCode) {
        email = `${req.cookies.emailID}@sequelstring.com`; // reconstruct email from prefix
        password = req.cookies.password;
        empRole = req.cookies.empRole;
        empCode = req.cookies.empCode;
    } else {
        // Get email and password from request body
        email = req.body.email;
        password = req.body.password;

        // Find employee by email
        emp = await employeeInfo.findOne({ email });

        // Check if employee exists and password matches
        if (!emp || emp.password !== password) {
            return res.render(path.join(__dirname, '../../public/views/loginPage', 'loginPage.ejs'), { message: 'Invalid email or password' ,alertType:'danger' });
        }

        // Extract necessary information from the found employee
        empRole = emp.role;
        empCode = emp.employeeCode;

        // Set cookies for email ID, password, empRole, and empCode
        const emailPrefix = email.split('@')[0];
        res.cookie("emailID", emailPrefix, { httpOnly: false });
        res.cookie("password", password, { httpOnly: false });
        res.cookie("empCode", empCode, { httpOnly: false });
        res.cookie("empRole", empRole, { httpOnly: false });
    }

    if (empRole === "executive") {
        res.redirect('/project-phases/home-emptyBoard')
    }
    else{
        res.redirect('/project-phases/home-dashboard')
    }
}


module.exports = {
    getLoginPage,
    verifyLogin
};
