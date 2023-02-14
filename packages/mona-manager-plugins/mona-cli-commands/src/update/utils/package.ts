const originPkg = require('../../../package.json');

export const getPkgPublicName = (pkg?: any) => (pkg || originPkg).name;

export const getPkgName = (pkg?: any) => (pkg || originPkg).displayName;

export const getPkgVersion = (pkg?: any) => (pkg || originPkg).version;
