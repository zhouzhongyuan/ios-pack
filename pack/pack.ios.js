import fs from 'fs-extra-promise';
import path from 'path';
import { svn, archive, ipa, imp, changeInfoPlist, upload, generatePlist, Logger, updateProject, fileExist, getPlistValue } from './util/index';
import config from '../config';
const workingDir = 'working';
const iosProjectDir = path.join(workingDir, 'iosprojects/project');
const iosLibDir = path.join(workingDir, 'libs');
const baseDir = process.cwd();
async function pack(task) {
    let returnValue;
    const logFile = `log/${task.id}.log`;
    const logger = Logger(logFile);
    try {
        logger.log('verbose', 'Pack begin.');
        const project = task.project.ios;
        const svnUrl = project.svn.url;
        const mobileProvision = project.mobileProvision.url;
        task.status.code = 'processing';
        await task.save();
        logger.log('info', 'Save task status processing success.');
        const impResult = await imp(mobileProvision);
        logger.log('info', impResult);
        logger.log('info', 'Install mobile provision success.');
        await fs.emptyDirAsync(workingDir);
        logger.log('info', `Empty ${workingDir} success.`);
        await fs.emptyDirAsync(iosProjectDir);
        await svn.get(svnUrl, project.svn.userName, project.svn.password, iosProjectDir);
        logger.log('info', `Get svn  ${svnUrl} success`);
        await fs.emptyDirAsync(`./${workingDir}/.svn`);
        await fs.emptyDirAsync(iosLibDir);
        logger.log('info', `Empty ${iosLibDir} success.`);
        await svn.get(task.framework.url, project.svn.userName, project.svn.password, iosLibDir);
        logger.log('info', `Get svn framework from ${task.framework.url} success`);
        process.chdir(iosProjectDir);
        const checkUpdateURL = `${config.server.checkUpdate}${task.project.id}`;
        const newInfoPlist = {
            CFBundleShortVersionString: task.version,
            UpdateAppURL: checkUpdateURL,
        };
        await changeInfoPlist('yesapp/Info.plist', newInfoPlist);
        logger.log('info', 'Change Info.plist success.');
        await archive(logger);
        await ipa(logger);
        const uploadIpaData = await upload(config.server.upload, 'build/yesapp.ipa', 'application/octet-stream');
        logger.log('info', 'Upload ipa file success');
        const bundleId = await getPlistValue('build/yesapp.xcarchive/Info.plist', 'ApplicationProperties.CFBundleIdentifier');
        const manifestJson = {
            items: [{
                assets: [{
                    kind: 'software-package',
                    url: uploadIpaData.url,
                }],
                metadata: {
                    'bundle-identifier': bundleId,
                    'bundle-version': task.version,
                    kind: 'software',
                    title: task.project.name,
                },
            }],
        };
        await generatePlist(manifestJson);
        logger.log('info', 'Generate manifest.plist success');
        const uploadPlistData = await upload(config.server.upload, 'manifest.plist', 'text/xml');
        logger.log('info', 'Upload manifest.plist success');
        task.targetUrl = uploadPlistData.url;
        await task.save();
        logger.log('info', 'Save manifest.plist to database success');
        task.status.code = 'success';
        await task.save();
        logger.log('info', 'Save task.status.code = "success" to database success');
        if (task.release) {
            // TODO 此处没有考虑android或者其他更改
            const lastReleaseIos = {
                taskId: task.id,
                version: task.version,
                releaseDate: new Date().toISOString(),
            };
            await updateProject(task.projectId, lastReleaseIos);
            logger.log('info', 'Update lastRelease success.');
        }
        returnValue = { success: true };
    } catch (ex) {
        logger.log('error', ex.message);
        task.status.code = 'fail';
        await task.save();
        logger.log('info', 'Save task.status.code = "fail" to database success.');
        returnValue = { success: false, message: ex.message };
    } finally {
        process.chdir(baseDir);
        logger.log('info', `Change dir to  ${baseDir} success.`);
        const isExist = await fileExist(logFile);
        if (!isExist) {
            return;
        }
        const uploadLogData = await upload(config.server.upload, logFile);
        task.status.log = uploadLogData.url;
        await task.save();
        fs.remove(logFile);
        return returnValue;
    }
}
export default pack;
// TODO 函数 cleanPack
