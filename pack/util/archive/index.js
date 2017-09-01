import { spawn } from 'child_process';
function archive(projectIOSName, logger) {
    return new Promise((resolve, reject) => {
        const ls = spawn('xcodebuild', ['-project', `${projectIOSName}.xcodeproj`, '-configuration', 'Distribution', '-scheme', `${projectIOSName}`, '-sdk', 'iphoneos', 'archive', '-archivePath', `./build/${projectIOSName}.xcarchive`]);
        ls.stdout.on('data', (data) => {
            logger.log('info', `Archive. ${data}`);
        });
        ls.stderr.on('data', (data) => {
            logger.log('error', `Archive. ${data}`);
            reject(data.toString());
        });
        ls.on('close', (code) => {
            resolve(code);
        });
    });
}
export default archive;
