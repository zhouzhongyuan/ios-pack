const process = require('process');
const spawn = require('child_process').spawn;
const fs = require('fs-extra');
var Client = require('svn-spawn');

//生成ipa的配置文件
const exportOptions = [__dirname,'exportOptions.plist'].join('/');
// 系统home文件夹
const userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
// workspace
const workspacePath = 'project/YIGO_IOS_PACK-del/yes_ios_0_0/project/workspace';
const workspaceFullPath = [userHome, workspacePath].join('/');
// svn
const projectPath = 'project/YIGO_IOS_PACK-del/yes_ios_0_0';
const projectFullPath = [userHome, projectPath].join('/');
// destination
// TODO fake
const releasePath = 'project/ios_compile/pack2/yigomobile/public/release/test';
// const releasePath = 'project/ios_compile/pack2/yigomobile/public/release/com.bokesoft.yigomobile/ios';
const releaseFullPath = [userHome, releasePath, '/yesapp.ipa'].join('/');




var startTime;

function pack() {
    startTime = Date.now();
    console.log('Begin pack……',startTime)
    process.chdir(projectFullPath);
    return new Promise(function (resolve, reject) {
        updateSvn()
            .then(function () {
                process.chdir(workspaceFullPath);
                fs.emptyDirSync('build');
                console.log('init……',Date.now() - startTime)
                return;
            })
            .then(function () {
                return archive();
            })
            .then(function () {
                console.log('ipa begin');
                return ipa();
            })
            .then(function () {
                return release();
            })
            .then(function () {
                fs.emptyDirSync('build');
                process.chdir(__dirname);
                resolve();
            })
            .catch(function (e) {
                console.log('ERROR');
                console.log(e)
                reject(e);
            });
    })

}
module.exports = pack;


// svn update
function updateSvn() {
    var client = new Client({
        username: 'zhouzy',
        password: 'zhouzy',
        noAuthCache: true,
    });
    return new Promise(function (resolve, reject) {
        client.update(function(err, data) {
            if(err){
                reject(new Error(err))
            }
            resolve(data);
        });
    });
};
// archive
function archive() {
    return new Promise(function (resolve, reject) {
        const PWD = workspaceFullPath;
        const ls = spawn('xcodebuild', ['-workspace', 'yigoworkspace.xcworkspace/', '-scheme', 'yesapp', '-sdk', 'iphoneos', 'archive', '-archivePath', `${PWD}/build/yesapp.xcarchive` ]);
        ls.stdout.on('data', (data) => {
        });
        ls.stderr.on('data', (data) => {

            reject(data.toString());
        });
        ls.on('close', (code) => {
            console.log('archive SUCCESS',Date.now() - startTime)
            resolve(code);
        });
    })
}
// 生成ipa
function ipa() {
    return new Promise(function (resolve, reject) {
        const PWD = workspaceFullPath;
        const ls = spawn('xcodebuild', ['-exportArchive', '-archivePath', `${PWD}/build/yesapp.xcarchive`, '-exportOptionsPlist', exportOptions, '-exportPath', `${PWD}/build`]);
        ls.stdout.on('data', (data) => {
        });
        ls.stderr.on('data', (data) => {
            data = data.toString();
            if(!data.match(/_createLoggingBundleAtPath/) && !data.match(/1./) && !data.match(/61/) ){
                reject(data);
            }
        });
        ls.on('close', (code) => {
            console.log('ipa SUCCESS',Date.now() - startTime)
            resolve(code);
        });
    })
}

function release() {
    const PWD = workspaceFullPath;
    return new Promise(function (resolve, reject) {
        fs.copy(`${PWD}/build/yesapp.ipa`, releaseFullPath, function (err) {
            if(err) {
                reject(err)
            }

            console.log('release SUCCESS',Date.now() - startTime)
            resolve("success!")
        });
    })
}




// 进入文件见,xcodebuild没法指定文件夹
// /Users/bokeadmin/project/YIGO_IOS_PACK-del/yes_ios_0_0/project/workspace

//xcodebuild -workspace  yigoworkspace.xcworkspace/ -scheme yesapp -sdk iphoneos  archive -archivePath $PWD/build/yesapp.xcarchive
// ['-workspace', 'yigoworkspace.xcworkspace/', '-scheme', 'yesapp', '-sdk', 'iphoneos', 'archive', '-archivePath', '$PWD/build/yesapp.xcarchive' ]

// xcodebuild -exportArchive -archivePath $PWD/build/yesapp.xcarchive -exportOptionsPlist exportOptions.plist -exportPath $PWD/build
