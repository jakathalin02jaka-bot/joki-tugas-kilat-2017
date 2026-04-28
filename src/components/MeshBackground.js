"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MeshBackground;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
function MeshBackground() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-700" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute w-[600px] h-[600px] rounded-full opacity-20", style: {
                    background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)',
                    top: '-10%',
                    left: '-10%',
                }, animate: {
                    x: [0, 50, 0, -30, 0],
                    y: [0, -30, 50, 20, 0],
                    scale: [1, 1.1, 0.95, 1.05, 1],
                }, transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute w-[500px] h-[500px] rounded-full opacity-15", style: {
                    background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)',
                    bottom: '-10%',
                    right: '-5%',
                }, animate: {
                    x: [0, -40, 30, -20, 0],
                    y: [0, 40, -20, 30, 0],
                    scale: [1, 0.9, 1.15, 0.95, 1],
                }, transition: { duration: 25, repeat: Infinity, ease: 'easeInOut' } }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute w-[400px] h-[400px] rounded-full opacity-10", style: {
                    background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
                    top: '40%',
                    left: '50%',
                }, animate: {
                    x: [0, 60, -40, 20, 0],
                    y: [0, -40, -20, 40, 0],
                    scale: [1, 1.2, 0.85, 1.1, 1],
                }, transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-[0.03]", style: {
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: '30px 30px',
                } })] }));
}
