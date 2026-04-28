"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var links = [
    { href: '/', label: 'Beranda' },
    { href: '/booking', label: 'Pesan' },
    { href: '/payment', label: 'Bayar' },
    { href: '/track', label: 'Cek Status' },
    { href: '/my-bookings', label: 'Booking Saya' },
    { href: '/admin', label: 'Admin' },
];
function Navbar() {
    var location = (0, react_router_dom_1.useLocation)();
    var path = location.pathname;
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    return ((0, jsx_runtime_1.jsxs)("nav", { className: "sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto px-4 h-16 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "flex items-center gap-2 font-bold text-lg text-purple-700", children: [(0, jsx_runtime_1.jsx)("span", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 16, className: "text-white" }) }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:block", children: "Joki Tugas Kilat" }), (0, jsx_runtime_1.jsx)("span", { className: "sm:hidden", children: "JTK" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden md:flex items-center gap-1", children: [links.filter(function (l) { return l.label !== 'Admin'; }).map(function (l) { return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: l.href, className: "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ".concat(path === l.href
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'), children: l.label }, l.href)); }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/booking", className: "ml-2 px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 14 }), "Pesan"] })] }), (0, jsx_runtime_1.jsx)("button", { className: "md:hidden p-2 rounded-lg text-gray-600 hover:bg-purple-50", onClick: function () { return setOpen(!open); }, "aria-label": "Toggle menu", children: open ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 20 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 20 }) })] }), open && ((0, jsx_runtime_1.jsx)("div", { className: "md:hidden border-t border-purple-100 bg-white px-4 py-3 flex flex-col gap-1", children: links.map(function (l) { return ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: l.href, onClick: function () { return setOpen(false); }, className: "px-4 py-2.5 rounded-lg text-sm font-medium transition-all ".concat(path === l.href
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'), children: l.label }, l.href)); }) }))] }));
}
