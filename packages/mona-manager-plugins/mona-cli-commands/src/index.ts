const init = require('./init');
const login = require('./login');
const logout = require('./logout');
const update = require('./update');
module.exports = [init, login, logout, update()];
