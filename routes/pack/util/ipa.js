const spawn = require('child_process').spawn;

function ipa(exportOption) {
    return new Promise((resolve, reject) => {
        const ls = spawn('xcodebuild', ['-exportArchive', '-archivePath', './build/yesapp.xcarchive', '-exportOptionsPlist', exportOption, '-exportPath', './build']);
        ls.stderr.on('data', (data) => {
            data = data.toString();
            console.log(data);
        });
        ls.on('close', (code) => {
            resolve(code);
        });
    });
}
export default ipa;
