'use strict';

const connector = require('../lib/connector');


// obsolete. equally same as getReachableGroups (curl "http://localhost:3000/ds/api?path=/json/apartment/getReachableGroups" | jq)
const getZones = (req, res, next) => {

  connector(`/json/apartment/getStructure`,
    (err, json) => {
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




const getReachableGroups = (req, res, next) => {
  connector(`/json/apartment/getReachableGroups`,
    (err, json) => {
      if (err) {
        return next(err);
      }
      req.structure = json.result.zones;
      next();
    });
};

const getScenes = (req, res, next) => {
  // connector(`/json/property/query?query=/apartment/zones/{*}(ZoneID)/groups/{*}(group)/scenes/{*}(scene,name)`,
  connector(`/json/property/query2?query=/apartment/zones/*(scenes)/groups/*(scenes)/scenes/*(name)`,
    (err, json) => {
      if (err) {
        return next(err);
      }
      // req.structScenes = json.result.zones;
      req.structScenes = json.result;
      next();
    });
};

const getDevices = (req, res, next) => {
  // connector(`/json/property/query?query=/apartment/zones/{*}(ZoneID)/groups/{*}(group)/devices/{*}(dSID,name,present)`,
  connector(`/json/property/query2?query=/apartment/zones/*(scenes)/groups/*(scenes)/devices/*(dSID,name,present)`,
    (err, json) => {
      if (err) {
        return next(err);
      }
      // req.structDevices = json.result.zones;
      req.structDevices = json.result;
      next();
    });
};

const _deviceObj2Arr = (devices) => {
  const ids = Object.keys(devices);
  const array = [];
  ids.forEach(id => {
    if (devices[id].present) {
      const { dSID, name } = devices[id];
      array.push({ dSID, name });
    }
  });
  return array;
};

const mergeStructure = (req, res, next) => {
  const { structure, structScenes, structDevices } = req;

  structure.forEach(zone => {
    const { zoneID, groups } = zone;
    const _groups = [];

    groups.forEach(id => {
      const scenes = structScenes[`zone${zoneID}`][`group${id}`];
      let devices = structDevices[`zone${zoneID}`][`group${id}`];
      devices = _deviceObj2Arr(devices);
      _groups.push({ id, scenes, devices });
    });

    zone.groups = _groups;
  });

  next();
};

const respond = (req, res) => {
  res.json(req.structure);
};



module.exports = {
  getZones,
  structure: [
    getReachableGroups,
    getScenes,
    getDevices,
    mergeStructure,
    respond
  ]
};
