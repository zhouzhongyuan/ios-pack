var express = require('express');
var router = express.Router();
var pack = require('../pack');
var plist = require('../plist');

var status = {
  busy: false
};

router.get('/', function(req, res, next) {
    res.render('pack', { title: '打包' });
});
router.get('/status', function(req, res, next) {
  res.json(status);
});
router.post('/', function(req, res, next) {
  status.busy = true;
  (function () {
    pack()
        .then(

        )
        .then(function () {
          status.busy = false;
          res.send('打包成功');
        })
        .catch(function () {
          status.busy = false;
          res.send('打包失败');
        });
    res.send('打包中');
  })();

});

module.exports = router;
