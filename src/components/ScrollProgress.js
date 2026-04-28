"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollProgress;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
function ScrollProgress() {
    var scrollYProgress = (0, framer_motion_1.useScroll)().scrollYProgress;
    var scaleX = (0, framer_motion_1.useSpring)(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "fixed top-0 left-0 right-0 h-1 z-[100] origin-left bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400", style: { scaleX: scaleX } }));
}
