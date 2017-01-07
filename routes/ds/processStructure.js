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

        const isPresent = (value) => {
            return value.isPresent;
        };

        zones
            .filter(isPresent)
            .forEach((zone) => {
                let devices = zone.devices.filter(isPresent);
                let groups = zone.groups
                    .filter(isPresent)
                    .filter((group) => {
                        return group.devices.length > 0;
                    })
                    .filter((group) => {
                        // find present group that contains present devices
                        return group.devices.find((dSUID) => {
                            return devices.find((device) => {
                                return device.dSUID === dSUID;
                            });
                        });
                    });

                // show existing live zones & groups
                console.log(`Active Zone: ${zone.name}`);
                groups.forEach((group) => {
                    console.log(`    Active Group: ${group.name}`);
                });

                // TODO test it
                // TODO test it
                // TODO test it
                // TODO test it
                // TODO test it
                // TODO test it
                // TODO test it
                // TODO test it

            });
    });

});

module.exports = router;
