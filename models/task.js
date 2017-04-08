import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    svnUrl: String,
    svnUsername: String,
    svnPassword: String,
    // projectId: String, //TODO 不应该保存前三个，而应该使用projectId
    version: String,
});
module.exports = mongoose.model('Task', taskSchema);
