import fs from 'fs-extra-promise';
import { svn, archive, ipa, release } from './util';
function pack(task) {
    // 处理数据
    const project = task.project.ios;
    const svnUrl = project.svn.url;
    return new Promise((resolve, reject) => {
        process.chdir('./working');
        return ipa();
        fs.emptyDirAsync('./working')
            .then(() => svn.get(svnUrl, project.svn.userName, project.svn.password))
            .then(() => {
                console.log('[1]更新SVN-成功');
                process.chdir('./working');
                console.log(process.cwd());
            })
            .then(() => {
                console.log('[2]archive-开始……');
                return archive();
            })
            .then(() => {
                console.log('[2]archive成功');
                console.log('[3]生成ipa-开始……');
                return ipa();
            })
            .catch((e) => {
                console.log('打包失败');
                console.log(e);
                reject(e);
            });
    });
}
export default pack;
