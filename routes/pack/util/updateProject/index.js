import { Project, Task } from '../../../../models/index';
async function updateProject(id,obj){
    const project = await Project.findById(id).exec();
    Object.assign(project,obj);
    await project.save();
}
export default updateProject;
