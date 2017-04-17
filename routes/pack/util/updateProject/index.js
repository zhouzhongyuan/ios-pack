import { Project, Task } from '../../../../models/index';
async function updateProject(id,obj){
    const project = await Project.findById(id).exec();
    project.lastRelease.ios = obj;
    console.log(project)
    await project.save();
}
export default updateProject;
