import fs from 'fs-extra-promise';
import { svn, archive, ipa, release, imp, changeInfoPlist, upload, generatePlist } from './util';
import config from '../../config';
function pack(task) {
    // 处理数据
    const project = task.project.ios;
    const svnUrl = project.svn.url;
    const mobileProvision = project.mobileProvision;
    return new Promise((resolve, reject) => {
        task.status.code = "processing";
        task.save()
            .then( (data) => {
                return fs.emptyDirAsync('./working');
            })
            .then(() => svn.get(svnUrl, project.svn.userName, project.svn.password))
            .then(() => {
                process.chdir('./working');
            })
            .then(() => {
                return archive();
            })
            .then(() => {
                return ipa();
            })
            .then(() => {
                return upload(config.server.upload, 'build/yesapp.ipa');
            })
            .then((data) => {
                let manifestJson = {
                    "items": [{
                        "assets": [{
                            "kind": "software-package",
                            "url": "https://dev.bokesoft.com/yigomobile/public/release/com.bokesoft.mobile/ios/yesapp.ipa"
                        }],
                        "metadata": {
                            "bundle-identifier": "com.bokesoft.mobile",
                            "bundle-version": "1.0.1",
                            "kind": "software",
                            "title": "YigoMobile"
                        }
                    }]
                };
                manifestJson.items[0].assets[0].url = data.url;
                return generatePlist(manifestJson);
            })
            .then((data) => {
                return upload(config.server.upload, 'manifest.plist');
            })
            .then((data) => {
                // 保存到数据库
                task.plistUrl = data.url;
                return task.save();
            })
            .then(() => {
                // after status code === success
                process.chdir('..');
                // return fs.emptyDirAsync('./working');
            })
            .then((data) => {
                console.log('pack success');
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

// TODO 函数 cleanPack, prepareMobileProvision
