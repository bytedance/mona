"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formatPath_1 = require("../../utils/formatPath");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Link = ({ children, to }) => react_1.default.createElement(react_router_dom_1.Link, { to: (0, formatPath_1.formatPath)(to) }, children);
exports.default = Link;
//# sourceMappingURL=index.js.map