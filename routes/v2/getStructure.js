'use strict';

const express = require('express');
const https = require('https');
const router = express.Router();
const connector = require('../../utils/connector');

router.get('/', (req, res, next) => {

    // 1. get apartment structure
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

        res.json({
            zones: _zones
        });

    });

});

module.exports = router;