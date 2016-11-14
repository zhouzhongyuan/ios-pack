const process = require('process');
const spawn = require('child_process').spawn;
const userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const projectPath = 'project/YIGO_IOS_PACK-del/yes_ios_0_0';
const workspacePath = 'project/YIGO_IOS_PACK-del/yes_ios_0_0/project/workspace';
const exportOptions = [__dirname,'exportOptions.plist'].join('/');


const workspaceFullPath = [userHome, workspacePath].join('/');




// TODO fake
const releasePath = 'project/ios_compile/pack2/yigomobile/public/release/test';
// const releasePath = 'project/ios_compile/pack2/yigomobile/public/release/com.bokesoft.yigomobile/ios';
const releaseFullPath = [userHome, releasePath, '/yesapp.ipa'].join('/');

const fs = require('fs-extra')




// 1.svn update
const projectFullPath = [userHome, projectPath].join('/');
process.chdir(projectFullPath);
var Client = require('svn-spawn');
var client = new Client({
    username: 'zhouzy', // optional if authentication not required or is already saved
    password: 'zhouzy', // optional if authentication not required or is already saved
    noAuthCache: true, // optional, if true, username does not become the logged in user on the machine
});

function updateSvn() {
    return new Promise(function (resolve, reject) {
        client.update(function(err, data) {
            if(err){
                reject(new Error(err))
            }
            resolve(data);
        });
    });
};
updateSvn()
    .then(function () {
        process.chdir(workspaceFullPath);
        return;
    })
    // .then(function () {
    //     return archive();
    // })
    .then(function () {
        console.log('ipa begin');
        return ipa();
    })
    .then(function () {
        return release();

    })
    .catch(function (e) {
        console.log('ERROR');
        console.log(e)
    });

// archive
function archive() {
    return new Promise(function (resolve, reject) {
        const PWD = workspaceFullPath;
        const ls = spawn('xcodebuild', ['-workspace', 'yigoworkspace.xcworkspace/', '-scheme', 'yesapp', '-sdk', 'iphoneos', 'archive', '-archivePath', `${PWD}/build/yesapp.xcarchive` ]);
        ls.stdout.on('data', (data) => {
        });
        ls.stderr.on('data', (data) => {
            reject(data);
        });
        ls.on('close', (code) => {
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
            resolve("success!")
        });
    })
}




// 进入文件见,xcodebuild没法指定文件夹
// /Users/bokeadmin/project/YIGO_IOS_PACK-del/yes_ios_0_0/project/workspace

//xcodebuild -workspace  yigoworkspace.xcworkspace/ -scheme yesapp -sdk iphoneos  archive -archivePath $PWD/build/yesapp.xcarchive
// ['-workspace', 'yigoworkspace.xcworkspace/', '-scheme', 'yesapp', '-sdk', 'iphoneos', 'archive', '-archivePath', '$PWD/build/yesapp.xcarchive' ]

// xcodebuild -exportArchive -archivePath $PWD/build/yesapp.xcarchive -exportOptionsPlist exportOptions.plist -exportPath $PWD/build
