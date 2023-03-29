const init = require('./init');
const login = require('./login');
const logout = require('./logout');
const update = require('./update');
const autoTest = require('./auto-test');
module.exports = [init, login, logout, update(), autoTest];
