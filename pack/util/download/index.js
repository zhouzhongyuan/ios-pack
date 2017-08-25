import request from 'request';
import fs from 'fs';
function download(url, file) {
    return new Promise((resolve, reject) => {
        const stream =
            request
                .get(url)
                .on('error', (err) => {
                    reject(`Download file '${url}' error, ${err.message}`);
                })
                .pipe(fs.createWriteStream(file));
        stream.on('error', (err) => {
            reject(`Stream error, ${err.message}`);
        });
        stream.on('finish', () => {
            resolve('Download success');
        });
    });
}
export default download;
