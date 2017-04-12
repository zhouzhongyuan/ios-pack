import upload from './index';
const url  = 'http://1.1.8.34:3001/upload';
const path = 'routes/pack/util/upload/yesapp.ipa';
async function test() {
    var r = await upload(url,path);
    console.log(r);
}
test();