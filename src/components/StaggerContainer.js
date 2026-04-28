"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StaggerContainer;
exports.StaggerItem = StaggerItem;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
function StaggerContainer(_a) {
    var children = _a.children, _b = _a.staggerDelay, staggerDelay = _b === void 0 ? 0.1 : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.once, once = _d === void 0 ? true : _d;
    var ref = (0, react_1.useRef)(null);
    var isInView = (0, framer_motion_1.useInView)(ref, { once: once, margin: '-40px' });
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { ref: ref, initial: "hidden", animate: isInView ? 'visible' : 'hidden', variants: {
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: staggerDelay,
                },
            },
        }, className: className, children: children }));
}
function StaggerItem(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { variants: {
            hidden: { opacity: 0, y: 30 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
            },
        }, className: className, children: children }));
}
