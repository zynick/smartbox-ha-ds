var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

// var status = 'ON';
//
// router.get('/status', function(req, res, next) {
//     console.log('get status:', status);
//     res.send(status);
// });
//
// router.post('/status', function(req, res, next) {
//     status = req.body === 'ON' ? 'ON' : 'OFF';
//     console.log('post status:', status);
//     res.send(status);
// });

module.exports = router;
