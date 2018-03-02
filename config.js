const IP = '1.1.8.25';

export default {
    db: {
        uri: `mongodb://${IP}/mbt`,
        options: {
            // user: 'admin',
            // pass: 'admin',
        },
    },
    server: {
        upload: `http://${IP}:3001/upload`,
        download: `http://${IP}:3001/download`,
        checkUpdate: 'https://dev.bokesoft.com/yigomobile2/checkupdate/',
    },
};
