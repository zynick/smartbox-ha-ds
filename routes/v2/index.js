'use strict';

const express = require('express');
const router = express.Router();
const isProd = express().get('env') === 'production';

router.use('/getStructure', require('./getStructure'));

/* Catch 404 and Forward to Error Handler */
router.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* Error Handlers */
router.use((err, req, res, next) => {
    let result = {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
    };
    // hide stacktrace in production, show otherwise
    if (!isProd) {
        result.stack = err.stack;
    }
    res
        .status(result.status)
        .json({
            error: result
        });
});


module.exports = router;