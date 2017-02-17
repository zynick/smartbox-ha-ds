'use strict';

const connector = require('../lib/connector');

// obsolete. equally same as getReachableGroups (curl "http://localhost:3000/ds/api?path=/json/apartment/getReachableGroups" | jq)
const getZones = (req, res, next) => {

  let path = `/json/apartment/getStructure`;
  connector(path, (err, json) => {
    if (err) {
      return next(err);
    }

    const isPresent = value => value.isPresent;
    const notBroadcast = value => value.id !== 0;
    let { zones } = json.result.apartment;
    let _zones = [];

    zones
      .filter(notBroadcast)
      .forEach(zone => {

        let presentDevices = zone.devices.filter(isPresent);
        let groups = zone.groups
          .filter(notBroadcast)
          .filter(isPresent)
          .filter(group =>
            // find group that contains present devices
            group.devices.find(dSUID =>
              presentDevices.find(device =>
                device.dSUID === dSUID
              )
            )
          );

        let _groups = [];
        groups.forEach(group => {
          const { id, name, color } = group;
          _groups.push({ id, name, color })
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
};

module.exports = { getZones };
