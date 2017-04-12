import fs from 'fs-extra-promise';
import { svn, archive, ipa, release, imp, changeInfoPlist, upload, generatePlist, Logger } from './util';
import config from '../../config';
async function pack(task) {
    try{
        const logger = Logger(`log/${task.id}.log`);
        logger.log('verbose', 'Pack begin.');
        const project = task.project.ios;
        const svnUrl = project.svn.url;
        const mobileProvision = project.mobileProvision;
        task.status.code = "processing";
        await task.save();
        logger.log('info', 'Save task status processing success.');
        await fs.emptyDirAsync('./working');
        logger.log('info', 'Empty working directory success.');
        await svn.get(svnUrl, project.svn.userName, project.svn.password);
        logger.log('info', 'Get svn success');
        process.chdir('./working');
        await changeInfoPlist('yesapp/Info.plist', task.version);
        logger.log('info', 'Change Info.plist version success.');
        await archive(logger);
        await ipa(logger);
        const uploadIpaData = await upload(config.server.upload, 'build/yesapp.ipa');
        logger.log('info', 'Upload ipa file success');
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
        logger.log('info', 'Generate manifest.plist success');
        const uploadPlistData = await upload(config.server.upload, 'manifest.plist');
        logger.log('info', 'Upload manifest.plist success');
        task.plistUrl = uploadPlistData.url;
        await task.save();
        logger.log('info', 'Save manifest.plist to database success');
        process.chdir('..');
        task.status.code = "success";
        await task.save();
        return {success: true};
    }catch (err){
        process.chdir('..');
        logger.log('error', err.message);
        task.status.code = "fail";
        await task.save();
        return {success: true, message:err.message};
    }
}
export default pack;

// TODO 函数 cleanPack, prepareMobileProvision
