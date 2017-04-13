import plist from 'plist';
import fs from 'fs';

async function changeInfoPlist(infoPlist, version) {
    const xml = await readFileAsync(infoPlist);
    const xmlStr = xml.toString();
    const versionReg = /(CFBundleShortVersionString<\/key>\n.*<string>)(.*)(<\/string>)/mig;
    const newXmlStr = xmlStr.toString().replace(versionReg, `$1${version}$3`);
    await writeFileAsync(infoPlist, newXmlStr);
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
        fs.writeFile(file, content, (err) => {
            if (err) reject(err);
            resolve(`Write file ${file} success.`);
        });
    })
}
export default changeInfoPlist;
