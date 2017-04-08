import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
    svnUrl: String,
    svnUsername: String,
    svnPassword: String,
    version: String,
    user: String,
    password: String,
    packageName: String,
    icon: String,
    plugin: Array,
});
module.exports = mongoose.model('Task', taskSchema);
