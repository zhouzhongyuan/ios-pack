import path from 'path';
import mp from 'mobileprovision';
import fs from 'fs-extra-promise';
import plist from 'plist';
import download from '../download/index';
function writeFile(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({
                success: true,
            });
        });
    });
}
async function installMobileProvision(mpUrl ) {
    const file = 'temp.mobileprovision';
    try {
        await download(mpUrl, file);
        const value = await mp(file);
        // generate exportOptions.plist
        const plistObj = {
            compileBitcode: false,
            method: 'enterprise',
            teamID: value.TeamIdentifier,
            provisioningProfiles: {
                [value.Name]: value.UUID,
            },
            thinning: '<none>',
        };
        const plistStr = plist.build(plistObj);
        await writeFile(path.resolve(__dirname, '../tmp/exportOptions_temp.plist'), plistStr);
        return value;
    } finally {
        await fs.remove(file);
    }
}
export default installMobileProvision;
