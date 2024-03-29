"use strict";
/**
 * [js-crc]{@link https://github.com/emn178/js-crc}
 *
 * @namespace crc
 * @version 0.2.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
    'use strict';
    var root = typeof window === 'object' ? window : {};
    var NODE_JS = !root.JS_CRC_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
    if (NODE_JS) {
        root = global;
    }
    var COMMON_JS = !root.JS_CRC_NO_COMMON_JS && typeof module === 'object' && module.exports;
    var AMD = typeof define === 'function' && define.amd;
    var ARRAY_BUFFER = !root.JS_CRC_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
    var HEX_CHARS = '0123456789abcdef'.split('');
    var Modules = [
        {
            name: 'crc32',
            polynom: 0xedb88320,
            initValue: -1,
            bytes: 4,
        },
        {
            name: 'crc16',
            polynom: 0xa001,
            initValue: 0,
            bytes: 2,
        },
    ];
    var i, j, k, b;
    for (i = 0; i < Modules.length; ++i) {
        var m = Modules[i];
        m.method = (function (m) {
            return function (message) {
                return crc(message, m);
            };
        })(m);
        m.table = [];
        for (j = 0; j < 256; ++j) {
            b = j;
            for (k = 0; k < 8; ++k) {
                b = b & 1 ? m.polynom ^ (b >>> 1) : b >>> 1;
            }
            m.table[j] = b >>> 0;
        }
    }
    var crc = function (message, module) {
        var notString = typeof message !== 'string';
        if (notString && ARRAY_BUFFER && message instanceof ArrayBuffer) {
            message = new Uint8Array(message);
        }
        var crc = module.initValue, code, i, length = message.length, table = module.table;
        if (notString) {
            for (i = 0; i < length; ++i) {
                crc = table[(crc ^ message[i]) & 0xff] ^ (crc >>> 8);
            }
        }
        else {
            for (i = 0; i < length; ++i) {
                code = message.charCodeAt(i);
                if (code < 0x80) {
                    crc = table[(crc ^ code) & 0xff] ^ (crc >>> 8);
                }
                else if (code < 0x800) {
                    crc = table[(crc ^ (0xc0 | (code >> 6))) & 0xff] ^ (crc >>> 8);
                    crc = table[(crc ^ (0x80 | (code & 0x3f))) & 0xff] ^ (crc >>> 8);
                }
                else if (code < 0xd800 || code >= 0xe000) {
                    crc = table[(crc ^ (0xe0 | (code >> 12))) & 0xff] ^ (crc >>> 8);
                    crc = table[(crc ^ (0x80 | ((code >> 6) & 0x3f))) & 0xff] ^ (crc >>> 8);
                    crc = table[(crc ^ (0x80 | (code & 0x3f))) & 0xff] ^ (crc >>> 8);
                }
                else {
                    code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++i) & 0x3ff));
                    crc = table[(crc ^ (0xf0 | (code >> 18))) & 0xff] ^ (crc >>> 8);
                    crc = table[(crc ^ (0x80 | ((code >> 12) & 0x3f))) & 0xff] ^ (crc >>> 8);
                    crc = table[(crc ^ (0x80 | ((code >> 6) & 0x3f))) & 0xff] ^ (crc >>> 8);
                    crc = table[(crc ^ (0x80 | (code & 0x3f))) & 0xff] ^ (crc >>> 8);
                }
            }
        }
        crc ^= module.initValue;
        var hex = '';
        if (module.bytes > 2) {
            hex +=
                HEX_CHARS[(crc >> 28) & 0x0f] +
                    HEX_CHARS[(crc >> 24) & 0x0f] +
                    HEX_CHARS[(crc >> 20) & 0x0f] +
                    HEX_CHARS[(crc >> 16) & 0x0f];
        }
        hex +=
            HEX_CHARS[(crc >> 12) & 0x0f] +
                HEX_CHARS[(crc >> 8) & 0x0f] +
                HEX_CHARS[(crc >> 4) & 0x0f] +
                HEX_CHARS[crc & 0x0f];
        return hex;
    };
    var exports = {};
    for (i = 0; i < Modules.length; ++i) {
        var m = Modules[i];
        exports[m.name] = m.method;
    }
    if (COMMON_JS) {
        module.exports = exports;
    }
    else {
        for (i = 0; i < Modules.length; ++i) {
            var m = Modules[i];
            root[m.name] = m.method;
        }
        if (AMD) {
            define(function () {
                return exports;
            });
        }
    }
})();
//# sourceMappingURL=crc32.js.map