"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NeonGlow;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
function NeonGlow(_a) {
    var _b = _a.color, color = _b === void 0 ? 'purple' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var colorMap = {
        purple: 'from-purple-500/30 via-indigo-500/20 to-purple-500/30',
        blue: 'from-blue-500/30 via-indigo-500/20 to-blue-500/30',
        pink: 'from-pink-500/30 via-rose-500/20 to-pink-500/30',
        cyan: 'from-cyan-500/30 via-teal-500/20 to-cyan-500/30',
        green: 'from-emerald-500/30 via-green-500/20 to-emerald-500/30',
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none overflow-hidden ".concat(className), children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: {
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.05, 1],
            }, transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, className: "absolute -inset-20 bg-gradient-to-r ".concat(colorMap[color], " blur-3xl rounded-full") }) }));
}
