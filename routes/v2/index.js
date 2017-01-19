'use strict';

const https = require('https');
const router = require('express').Router();
const connector = require('../../utils/connector');
const isProd = process.env.NODE_ENV === 'production';


router.get('/zones', (req, res, next) => {

    let path = `/json/apartment/getStructure`;
    connector(path, (err, json) => {
        if (err) {
            return next(err);
        }

        let {
            clusters,
            zones
        } = json.result.apartment;

        const isPresent = value => value.isPresent;
        const notBroadcast = value => value.id !== 0;

        let _zones = [];

        zones
            .filter(notBroadcast)
            .forEach(zone => {

                let presentDevices = zone.devices.filter(isPresent);
                let groups = zone.groups
                    .filter(notBroadcast)
                    .filter(isPresent)
                    .filter(group => {
                        // find group that contains present devices
                        return group.devices.find(dSUID => {
                            return presentDevices.find(device => {
                                return device.dSUID === dSUID;
                            });
                        });
                    });

                let _groups = [];
                groups.forEach(group => {
                    _groups.push({
                        id: group.id,
                        name: group.name,
                        color: group.color
                    });
                });

                const zoneName = zone.name.length > 0 ? zone.name : `Room #${zone.id}`;
                _zones.push({
                    id: zone.id,
                    name: zoneName,
                    groups: _groups
                });
            });

        res.json(_zones);

    });

});


/* 404 & Error Handlers */
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const error = { status, message };
    // hide stacktrace in production, show otherwise
    if (!isProd) { error.stack = err.stack; }
    res
        .status(status)
        .json({ error });
});


module.exports = router;