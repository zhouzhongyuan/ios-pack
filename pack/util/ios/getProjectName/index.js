import fs from 'fs';
async function getProjectName(path) {
    path = path || '.';
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) {
                reject(err);
            }
            const projectRegex = /(.*)\.xcodeproj$/;
            data.forEach((item) => {
                if (projectRegex.test(item)) {
                    const name = projectRegex.exec(item)[1];
                    resolve(name);
                }
            });
            reject('No this file.');
        });
    });
}
export default getProjectName;
