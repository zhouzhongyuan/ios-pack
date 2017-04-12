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
            console.log(body);
            let data = body;
            if(typeof body === 'string'){
                data = JSON.parse(body);
            }
            resolve(data);
        });
    })
}
export default upload;