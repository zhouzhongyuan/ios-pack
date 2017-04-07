import Client from 'svn-spawn';
function getSvn(url, dir, username, password) {
    return new Promise((resolve, reject) => {
        const client = new Client({
            cwd: dir,
            username,
            password,
        });
        client.checkout(url, (err, data) => {
            if (err) {
                reject(new Error(err));
            }
            resolve(data);
        });
    });
}
export default getSvn;
