import mongoose from 'mongoose';
import { projectSchema } from './project';
const taskSchema = new mongoose.Schema({
    id: String,
    projectId: String,
    project: projectSchema,
    version: String,
    platform: String,
    configuration: String,
    release: Boolean,
    status: {
        code: String,
        log: String,
    },
    dateOfCreate: { type: Date, default: Date.now },
});
const Task = mongoose.model('Task', taskSchema);
export default Task;
export {
    taskSchema,
    Task,
};