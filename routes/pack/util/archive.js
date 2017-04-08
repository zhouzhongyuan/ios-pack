const spawn = require('child_process').spawn;

function archive() {
    return new Promise((resolve, reject) => {
        const ls = spawn('xcodebuild', ['-project', 'yesapp.xcodeproj', '-scheme', 'yesapp', '-sdk', 'iphoneos', 'archive', '-archivePath', './build/yesapp.xcarchive']);
        ls.stderr.on('data', (data) => {
            reject(data.toString());
        });
        ls.on('close', (code) => {
            resolve(code);
        });
    });
}
export default archive;
