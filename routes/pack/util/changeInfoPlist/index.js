import plist from 'plist';
import fs from 'fs';

async function changeInfoPlist(infoPlist, version) {
    const xml = await readFileAsync(infoPlist);
    let json = plist.parse(xml.toString());
    console.log(json)
    await writeFileAsync(infoPlist, plist.build(json));

}
function readFileAsync(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    })
}
function writeFileAsync(file, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile('./Info-new.plist', content, (err) => {
            console.log(err);
            if (err) reject(err);
            resolve(`Write file ${file} success.`);
        });
    })
}
export default changeInfoPlist;
