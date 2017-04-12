import fs from 'fs-extra-promise';
import imp from './util/installMobileProvision';
import { svn, archive, ipa, release } from './util';
function pack(task) {
    // 处理数据
    const project = task.project.ios;
    const svnUrl = project.svn.url;
    const mobileProvision = project.mobileProvision;
    return new Promise((resolve, reject) => {
        // process.chdir('./working');
        // return ipa();
        task.status.code = "processing";
        task.save()
            // .then( () => {
            //     return imp(mobileProvision);
            // })
            .then( (data) => {
                console.log('===update status.code===');
                return fs.emptyDirAsync('./working');
            })
            .then(() => svn.get(svnUrl, project.svn.userName, project.svn.password))
            .then(() => {
                console.log('[1]更新SVN-成功');
                process.chdir('./working');
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
/*            .then(() => {
                console.log('[3]生成ipa-成功……');
                console.log('[4]上传ipa-开始……');
                return upload();
            })
            .then((data) => {
                console.log('[4]上传ipa-成功……');
                // 保存到数据库
                task.ipaUrl = data.url;
                task.save();
                return data;
            })
            .then((data) => {
                // 生成plist
                return generatePlist();
            })
            .then((data) => {
                // 上传plist
                return upload();
            })
            .then((data) => {
                // 保存到数据库
                task.ipaUrl = data.url;
                task.save();
                return data;
            })*/
            .then((data) => {
                // after status code === success
                process.chdir('..');
                return fs.emptyDirAsync('./working');
            })
            .then((data) => {
                // pack success
                task.status.code = "success";
                task.save()
                    .then(() => {
                        resolve({success: true});
                    });
            })
            .catch((e) => {
                task.status.code = "fail";
                task.save();
                console.log('打包失败',e);
                reject(e);
            });
    });
}
export default pack;

// TODO 三个函数 upload, cleanPack, prepareMobileProvision
