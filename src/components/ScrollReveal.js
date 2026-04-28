"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollReveal;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var dirMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
};
function ScrollReveal(_a) {
    var children = _a.children, _b = _a.direction, direction = _b === void 0 ? 'up' : _b, _c = _a.delay, delay = _c === void 0 ? 0 : _c, _d = _a.duration, duration = _d === void 0 ? 0.5 : _d, _e = _a.className, className = _e === void 0 ? '' : _e, _f = _a.once, once = _f === void 0 ? true : _f;
    var ref = (0, react_1.useRef)(null);
    var isInView = (0, framer_motion_1.useInView)(ref, { once: once, margin: '-50px' });
    var offset = dirMap[direction];
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { ref: ref, initial: __assign({ opacity: 0 }, offset), animate: isInView ? { opacity: 1, y: 0, x: 0 } : __assign({ opacity: 0 }, offset), transition: { duration: duration, delay: delay, ease: [0.25, 0.46, 0.45, 0.94] }, className: className, children: children }));
}
