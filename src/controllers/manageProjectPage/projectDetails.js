const { projectInfo } = require('../../models/projectInfo');
const { employeeInfo } = require('../../models/employeeInfo');

async function getClientNames(req, res) {
    try {
        const clientNames = await projectInfo.aggregate([
            { $group: { _id: "$clientName" } },
            { $project: { _id: 0, clientName: "$_id" } }
        ]);

        const lowerCaseClientNames = clientNames.map(client => client.clientName.toLowerCase());
        res.json(lowerCaseClientNames);
    } catch (error) {
        console.error('Error fetching client names:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getProjectList(req,res){
    const clientName = req.query.clientName

    const projects = await projectInfo.aggregate([
        {
            $match:{
                clientName: clientName

        }
        },
        {
            $project:{
                projectName:1,
                _id:0
            }
        }
    ])

    const projectList = projects.map(project => project.projectName);
    res.json(projectList);

}



async function getTeamMemberList(req, res) {
    try {
        const managerName = req.query.managerName;
        const managerArray = managerName.split(',').map(name => name.trim());

        const result = await employeeInfo.aggregate([
            { $match: { managersName: { $in: managerArray } } },
            { $project: { employeeName: 1, _id: 0 } }
        ]);

        const teamMemberList = result.map(doc => doc.employeeName);
        res.json(teamMemberList);
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



async function getManagerList(req, res) {
    try {
        const managerType = req.query.managerType;
        const departmentMap = {
            techManager: ['automation', 'backend developer', 'frontend developer'],
            deliveryManager: ['delivery'],
            salesManager: ['sales'],
            testingManager: ['qa'],
            businessAnalystManager: ['business analyst']
        };

        const empDepartment = departmentMap[managerType] || [];
        const employees = await employeeInfo.aggregate([
            {
                $match: {
                    designation: "manager",
                    employeeDepartment: { $in: empDepartment }
                }
            },
            {
                $project: {
                    employeeName: 1,
                    _id: 0
                }
            }
        ]);

        const managers = employees.map(employee => employee.employeeName);
        res.json(managers);
    } catch (error) {
        console.error('Error fetching manager names:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    getClientNames,
    getProjectList,
    getTeamMemberList,
    getManagerList
}