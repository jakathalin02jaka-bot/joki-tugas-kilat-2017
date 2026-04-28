"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TiltCard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
function TiltCard(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.tiltAmount, tiltAmount = _c === void 0 ? 12 : _c, _d = _a.glowColor, glowColor = _d === void 0 ? 'rgba(147, 51, 234, 0.25)' : _d, _e = _a.perspective, perspective = _e === void 0 ? 800 : _e;
    var ref = (0, react_1.useRef)(null);
    var x = (0, framer_motion_1.useMotionValue)(0);
    var y = (0, framer_motion_1.useMotionValue)(0);
    var springConfig = { stiffness: 300, damping: 25 };
    var rotateX = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
    var rotateY = (0, framer_motion_1.useSpring)((0, framer_motion_1.useTransform)(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);
    var handleMouseMove = function (e) {
        if (!ref.current)
            return;
        var rect = ref.current.getBoundingClientRect();
        var cx = (e.clientX - rect.left) / rect.width - 0.5;
        var cy = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(cx);
        y.set(cy);
    };
    var handleMouseLeave = function () {
        x.set(0);
        y.set(0);
    };
    var glowX = (0, framer_motion_1.useTransform)(x, [-0.5, 0.5], ['0%', '100%']);
    var glowY = (0, framer_motion_1.useTransform)(y, [-0.5, 0.5], ['0%', '100%']);
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { ref: ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, style: {
            rotateX: rotateX,
            rotateY: rotateY,
            perspective: perspective,
            transformStyle: 'preserve-3d',
        }, className: "relative ".concat(className), children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", style: {
                    background: "radial-gradient(circle at ".concat(glowX, " ").concat(glowY, ", ").concat(glowColor, ", transparent 60%)"),
                } }), children] }));
}
