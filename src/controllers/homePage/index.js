async function homePage(req, res){
    
    empRole = req.cookies.empRole
    empCode = req.cookies.empCode

    if (empRole === "executive") {
        res.redirect('/project-phases/home-emptyBoard')
    }
    else{
        res.redirect('/project-phases/home-dashboard')
    }
}

module.exports = {
    homePage
};
