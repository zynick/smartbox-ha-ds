'use strict';

const express = require('express');
const https = require('https');
const router = express.Router();
const connector = require('../../utils/connector');

router.get('/', (req, res) => {

    // 1. get apartment structure
    let path = `/json/apartment/getStructure`;
    connector(path, (err, json) => {
        if (err) {
            return res.json({
                ok: false,
                message: err.message
            });
        }

        if (!json.ok) {
            return res.json(json);
        }


        let {
            clusters,
            zones
        } = json.result.apartment;

        const isPresent = value => value.isPresent;

        const notBroadcast = value => value.id !== 0;

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

                const zoneName = zone.name.length > 0 ? zone.name : `Room #${zone.id}`;

                // show existing live zones & groups
                console.log(`Active Zone: ${zoneName}`);
                groups.forEach(group => {
                    console.log(`    Active Group: ${group.name}`);
                });

            });

        res.send('ok');
    });

});

module.exports = router;