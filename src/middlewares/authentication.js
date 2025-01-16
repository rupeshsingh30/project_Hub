const path = require('path');

async function restrictToLoginUserOnly(req, res, next) {
    const emailID = req.cookies?.emailID;
    const empCode = req.cookies?.empCode;

    if (!emailID) {
        const filePath = path.join(__dirname, '../../src/public/views/loginPage', 'loginPage.ejs');
        return res.render(filePath);
    }

    req.emailID = emailID;
    next();
}

module.exports = restrictToLoginUserOnly;
