const express = require('express');
const router = express.Router();
const pack = require('./pack');
const plist = require('../plist');
const status = {
    busy: false,
};
router.get('/', (req, res, next) => {
    res.render('pack', { title: '打包' });
});
router.get('/status', (req, res, next) => {
    res.json(status);
});
router.post('/', (req, res, next) => {
    status.busy = true;
    (function () {
        pack()
            .then(
            )
            .then(() => {
                status.busy = false;
                res.send('打包成功');
            })
            .catch(() => {
                status.busy = false;
                res.send('打包失败');
            });
        res.send('打包中');
    }());
});
module.exports = router;
