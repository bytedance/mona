const start = require('./start');
const build = require('./build');
const compress = require('./compress');
const preview = require('./preview');
const publish = require('./publish');
module.exports = [start, build, compress, preview, publish];
