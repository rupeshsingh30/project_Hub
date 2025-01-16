const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    status: { type: String, required: true },
    updatedBy: { type: String, required: true },
    updatedAt: { type: String, required: true },
});

const PhaseSchema = new mongoose.Schema({
    start_date: { type: String, default: '' },
    end_date: { type: String, default: '' },
    status: { type: String, default: '' },
    history: { type: [HistorySchema], default: [] },
    updatedBy: { type: String, required: true },
    updatedAt: { type: String, required: true },
});

const ProjectSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    projectName: { type: String, required: true },
    botId: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: String, required: true },
    resources: {
        delivery: {
            manager: { type: [String], required: true },
            teamMembers: { type: [String], required: true },
        },
        development: {
            manager: { type: [String], required: true },
            teamMembers: { type: [String], required: true },
        },
        testing: {
            manager: { type: [String], required: true },
            teamMembers: { type: [String], required: true },
        },
        sales: {
            manager: { type: [String], required: true },
            teamMembers: { type: [String], required: true },
        },
        businessAnalyst: {
            manager: { type: [String], required: true },
            teamMembers: { type: [String], required: true },
        },
    },
    phase: {
        discussion: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) },
        poc: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) },
        dev: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) },
        testing: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) },
        uat: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) },
        prd: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) },
        on_hold: { type: PhaseSchema, default: () => ({ updatedBy: '', updatedAt: new Date().toISOString() }) }
    }
}, {
    collection: 'projectInfo'
});

const projectInfo = mongoose.model('projectInfo', ProjectSchema);

module.exports = { projectInfo };
