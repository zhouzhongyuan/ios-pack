import mongoose from 'mongoose';
import { projectSchema } from './task';
const taskSchema = new mongoose.Schema({
    projectId: String,
    version: String,
    project: projectSchema,
});
const Task = mongoose.model('Task', taskSchema);
export default Task;
export {
    taskSchema,
    Task,
};
