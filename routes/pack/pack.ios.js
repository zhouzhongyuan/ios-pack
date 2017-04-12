import fs from 'fs-extra-promise';
import { svn, archive, ipa, release, imp, changeInfoPlist, upload, generatePlist } from './util';
import config from '../../config';
async function pack(task) {
    console.log(task);
    try{
        const project = task.project.ios;
        const svnUrl = project.svn.url;
        const mobileProvision = project.mobileProvision;
        task.status.code = "processing";
        await task.save();
        await fs.emptyDirAsync('./working');
        await svn.get(svnUrl, project.svn.userName, project.svn.password)
        process.chdir('./working');
        await changeInfoPlist('yesapp/Info.plist', task.version);
        await archive();
        await ipa();
        const uploadIpaData = await upload(config.server.upload, 'build/yesapp.ipa');
        const manifestJson = {
            "items": [{
                "assets": [{
                    "kind": "software-package",
                    "url": uploadIpaData.url
                }],
                "metadata": {
                    "bundle-identifier": task.packageName,
                    "bundle-version": task.version,
                    "kind": "software",
                    "title": task.name
                }
            }]
        };
        await generatePlist(manifestJson);
        const uploadPlistData = await upload(config.server.upload, 'manifest.plist');
        task.plistUrl = uploadPlistData.url;
        await task.save();
        process.chdir('..');
        task.status.code = "success";
        await task.save();
        return {success: true};
    }catch (err){
        task.status.code = "fail";
        await task.save();
        return {success: true, message:err.message};
    }
}
export default pack;

// TODO 函数 cleanPack, prepareMobileProvision
