import path from 'path';
import { spawn } from 'child_process';
import exportOptionsPlist from './exportOptions.plist';
const exportOptionsPlistAbsolutePath = path.join(path.dirname(process.argv[1]), exportOptionsPlist);
function ipa(logger) {
    return new Promise((resolve, reject) => {
        const ls = spawn('xcodebuild', ['-exportArchive', '-archivePath', './build/yesapp.xcarchive', '-exportOptionsPlist', exportOptionsPlistAbsolutePath, '-exportPath', './build']);
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
