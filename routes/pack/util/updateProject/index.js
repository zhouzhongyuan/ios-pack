import { Project, Task } from '../../../../models/index';
async function updateProject(id,obj){
    const project = await Task.findById(id).exec();
    Object.assign(project,obj);
    await project.save();
}
export default updateProject;
