import request from 'request';
import fs from 'fs';
function upload(url, filePath) {
    return new Promise((resolve, reject) => {
        const formData = {
            file: fs.createReadStream(filePath),
        };
        request.post({url:url, formData: formData}, (err, httpResponse, body) => {
            if(err){
                reject(err);
            }
            resolve(body);
        });
    })
}
export default upload;