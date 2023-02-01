const pkg = require('../../../package.json');

export const getPkgPublicName = () => pkg.name;

export const getPkgName = () => pkg.displayName;

export const getPkgVersion = () => pkg.version;
