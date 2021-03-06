import fs from 'fs-extra-promise';
import path from 'path';
import { unlockKeychain } from 'mac-keychain';
import { svn, archive, ipa, imp, importCertificate, changeInfoPlist, upload, generatePlist, Logger, updateProject, fileExist, getPlistValue, getProjectName } from './util/index';
import config from '../config';
import preparePack from './preparePack';
const workingDir = 'working';
const iosProjectDir = path.join(workingDir, 'iosprojects/project');
const iosLibDir = path.join(workingDir, 'libs');
const baseDir = process.cwd();
async function pack(task) {
    let returnValue;
    const logFile = `log/${task.id}.log`;
    const logger = Logger(logFile);
    let mobileProvisionInstallLocation;
    try {
        logger.log('verbose', 'Prepare Pack begin.');
        await preparePack();
        logger.log('verbose', 'Prepare Pack success.');
        logger.log('verbose', 'Pack begin.');
        const project = task.project.ios;
        const svnUrl = project.svn.url;
        const mobileProvision = project.mobileProvision.url;
        task.status.code = 'processing';
        await task.save();
        logger.log('info', 'Save task status processing success.');
        const certificateUrl = project.certificate.file.url;
        if (certificateUrl) {
            const icResult = await importCertificate(certificateUrl, project.certificate.password);
            logger.log('info', icResult);
        } else {
            logger.log('info', 'No certificate.');
        }
        const impResult = await imp(mobileProvision);
        mobileProvisionInstallLocation = impResult.installLocation;
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
        const projectIOSName = await getProjectName();
        const checkUpdateURL = `${config.server.checkUpdate}${task.project.id}`;
        const newInfoPlist = {
            CFBundleShortVersionString: task.version,
            UpdateAppURL: checkUpdateURL,
        };
        await changeInfoPlist(`${projectIOSName}/Info.plist`, newInfoPlist);
        logger.log('info', 'Change Info.plist success.');
        await unlockKeychain('1111');
        logger.log('info', 'Unlock keychain success.');
        await archive(projectIOSName, logger);
        await ipa(projectIOSName, logger);
        const uploadIpaData = await upload(config.server.upload, `build/${projectIOSName}.ipa`, 'application/octet-stream');
        logger.log('info', `Upload ipa file success. The url is ${uploadIpaData.url}.`);
        const bundleId = await getPlistValue(`build/${projectIOSName}.xcarchive/Info.plist`, 'ApplicationProperties.CFBundleIdentifier');
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
        logger.log('info', `Upload manifest.plist success. The url is ${uploadPlistData.url}.`);
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
        if (mobileProvisionInstallLocation) {
            logger.log('info', `Delete installed mobileprovision "${mobileProvisionInstallLocation}" begin.`);
            await fs.remove(mobileProvisionInstallLocation);
            logger.log('info', `Delete installed mobileprovision "${mobileProvisionInstallLocation}" success.`);
        }
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
