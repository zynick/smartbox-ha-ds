'use strict';

const connector = require('../lib/connector');


const structGetReachableGroups = (req, res, next) => {
  connector(`/json/apartment/getReachableGroups`,
    (err, json) => {
      if (err) {
        return next(err);
      }
      req.structure = json.result.zones;
      next();
    });
};

const structGetScenes = (req, res, next) => {
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

const structGetDevices = (req, res, next) => {
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

const structMergeStructure = (req, res, next) => {
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

const _hasGroups = zone => zone.groups.length > 0;

const _setDefaultZoneName = zone => {
  if (zone.name === '') {
    zone.name = `Room #${zone.zoneID}`;
  }
  return zone;
};

const structCleanStructure = (req, res, next) => {
  let { structure } = req;
  structure = structure.filter(_hasGroups);
  structure = structure.map(_setDefaultZoneName);
  req.structure = structure;
  next();
}

const structResponse = (req, res) => res.json(req.structure);

module.exports = {
  structGetReachableGroups,
  structGetScenes,
  structGetDevices,
  structMergeStructure,
  structCleanStructure,
  structResponse
};
