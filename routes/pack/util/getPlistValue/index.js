import plist from 'plist';
import fs from 'fs';

async function getPlistValue(infoPlist, propKey) {
    const xml = await readFileAsync(infoPlist);
    const xmlStr = xml.toString();
    let json = plist.parse(xmlStr);
    var propKeyArr = propKey.trim().split('.');
    var value = json;
    propKeyArr.forEach((v) => {
        value = value[v];
    })
    return value;
}
function readFileAsync(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    })
}
export default getPlistValue;
