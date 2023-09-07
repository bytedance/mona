const init = require('./init');
const login = require('./login');
const logout = require('./logout');
const update = require('./update');
const autoTest = require('./auto-test');
const server = require('./server-client');

module.exports = [init, login, logout, update(), autoTest, server];
