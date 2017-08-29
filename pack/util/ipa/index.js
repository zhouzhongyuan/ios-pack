import path from 'path';
import { spawn } from 'child_process';
const exportOptionsPlistAbsolutePath = path.resolve(__dirname, '../tmp/exportOptions_temp.plist');
function ipa(projectIOSName, logger) {
    return new Promise((resolve) => {
        const ls = spawn('xcodebuild', ['-exportArchive', '-archivePath', `./build/${projectIOSName}.xcarchive`, '-exportOptionsPlist', exportOptionsPlistAbsolutePath, '-exportPath', './build']);
        ls.stdout.on('data', (data) => {
            logger.log('info', `Generate IPA. ${data}`);
        });
        ls.stderr.on('data', (data) => {
            data = data.toString();
            logger.log('error', `Generate IPA. ${data}`);
        });
        ls.on('close', (code) => {
            resolve(code);
        });
    });
}
export default ipa;
// TODO 应该要大改。现在使用的命令有点老旧了。
// https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man1/xcodebuild.1.html
