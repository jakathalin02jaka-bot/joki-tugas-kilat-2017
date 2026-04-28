"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DarkModeToggle;
var jsx_runtime_1 = require("react/jsx-runtime");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var AppContext_1 = require("../context/AppContext");
function DarkModeToggle() {
    var _a = (0, AppContext_1.useApp)(), darkMode = _a.darkMode, toggleDarkMode = _a.toggleDarkMode;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileTap: { scale: 0.85 }, onClick: toggleDarkMode, className: "relative w-12 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 flex items-center px-1", "aria-label": darkMode ? 'Light mode' : 'Dark mode', children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { x: darkMode ? 20 : 0 }, transition: { type: 'spring', stiffness: 500, damping: 30 }, className: "w-5 h-5 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center", children: darkMode ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Moon, { size: 11, className: "text-purple-400" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Sun, { size: 11, className: "text-yellow-500" })) }) }));
}
