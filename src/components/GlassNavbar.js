"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlassNavbar;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var links = [
    { href: '/', label: 'Beranda' },
    { href: '/booking', label: 'Pesan' },
    { href: '/payment', label: 'Bayar' },
    { href: '/track', label: 'Cek' },
    { href: '/my-bookings', label: 'Saya' },
    { href: '/admin', label: 'Admin', isAdmin: true },
];
var desktopLinks = links.filter(function (l) { return !l.isAdmin; });
function GlassNavbar() {
    var location = (0, react_router_dom_1.useLocation)();
    var path = location.pathname;
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var _b = (0, react_1.useState)(false), scrolled = _b[0], setScrolled = _b[1];
    (0, react_1.useEffect)(function () {
        var onScroll = function () { return setScrolled(window.scrollY > 30); };
        window.addEventListener('scroll', onScroll, { passive: true });
        return function () { return window.removeEventListener('scroll', onScroll); };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.nav, { initial: { y: -100 }, animate: { y: 0 }, transition: { duration: 0.6, ease: 'easeOut' }, className: "sticky top-0 z-50 transition-all duration-500 ".concat(scrolled
            ? 'bg-white/70 backdrop-blur-xl shadow-lg shadow-purple-100/30 border-b border-white/30'
            : 'bg-transparent'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto px-4 h-16 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "flex items-center gap-2.5 font-bold text-lg text-purple-700 group", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { rotate: 360, scale: 1.1 }, transition: { duration: 0.5 }, className: "w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-300/40", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 18, className: "text-white" }) }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:block group-hover:text-purple-800 transition-colors", children: "Joki Tugas Kilat" }), (0, jsx_runtime_1.jsx)("span", { className: "sm:hidden", children: "JTK" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden md:flex items-center gap-1", children: [desktopLinks.map(function (l) { return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: l.href, className: "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ".concat(path === l.href
                                    ? 'text-purple-700'
                                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'), children: [path === l.href && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { layoutId: "nav-pill", className: "absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-xl shadow-sm", transition: { type: 'spring', stiffness: 350, damping: 30 } })), (0, jsx_runtime_1.jsx)("span", { className: "relative z-10", children: l.label })] }, l.href)); }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/admin", className: "relative ml-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 ".concat(path === '/admin'
                                    ? 'text-purple-700'
                                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'), children: [path === '/admin' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { layoutId: "nav-pill-admin", className: "absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-xl shadow-sm", transition: { type: 'spring', stiffness: 350, damping: 30 } })), (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { size: 14, className: "relative z-10" }), (0, jsx_runtime_1.jsx)("span", { className: "relative z-10", children: "Admin" })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/booking", className: "ml-2 flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-300/40 hover:shadow-xl hover:shadow-purple-300/50 transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 14 }), "Pesan"] }) })] }), (0, jsx_runtime_1.jsx)("button", { className: "md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-purple-50/80 hover:text-purple-700 transition-all", onClick: function () { return setOpen(!open); }, children: open ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 20 }) })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: open && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "md:hidden overflow-hidden bg-white/80 backdrop-blur-xl border-t border-purple-100/50", children: (0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3 flex flex-col gap-1", children: links.map(function (l) { return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: l.href, onClick: function () { return setOpen(false); }, className: "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ".concat(path === l.href
                                ? l.isAdmin
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-purple-50/60 hover:text-purple-700'), children: [l.isAdmin && (0, jsx_runtime_1.jsx)(lucide_react_1.ShieldCheck, { size: 14, className: path === l.href ? 'text-white' : 'text-gray-400' }), l.label] }, l.href)); }) }) })) })] }));
}
