import Client from 'svn-spawn';
function get(url, username, password, dir) {
    const dirPath = dir || './working';
    return new Promise((resolve, reject) => {
        const client = new Client({
            cwd: dirPath,
            username,
            password,
        });
        client.cmd(['checkout', url, '.', '--quiet'], (err, data) => {
            if (err) {
                reject(new Error(err));
            }
            resolve(data);
        });
    });
}
export default {
    get,
};
