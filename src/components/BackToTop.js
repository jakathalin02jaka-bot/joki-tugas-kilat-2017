"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackToTop;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
function BackToTop() {
    var _a = (0, react_1.useState)(false), visible = _a[0], setVisible = _a[1];
    (0, react_1.useEffect)(function () {
        var onScroll = function () { return setVisible(window.scrollY > 600); };
        window.addEventListener('scroll', onScroll, { passive: true });
        return function () { return window.removeEventListener('scroll', onScroll); };
    }, []);
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: visible && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.5 }, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: function () { return window.scrollTo({ top: 0, behavior: 'smooth' }); }, className: "fixed bottom-24 right-6 z-50 w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-300/40 flex items-center justify-center text-white hover:from-purple-500 hover:to-indigo-500 transition-colors", "aria-label": "Kembali ke atas", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { size: 20 }) })) }));
}
