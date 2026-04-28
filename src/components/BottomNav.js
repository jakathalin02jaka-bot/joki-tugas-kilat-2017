"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BottomNav;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var AppContext_1 = require("../context/AppContext");
var items = [
    { to: '/', icon: lucide_react_1.Home, label: 'Beranda' },
    { to: '/booking', icon: lucide_react_1.ClipboardPlus, label: 'Pesan' },
    { to: '/payment', icon: lucide_react_1.CreditCard, label: 'Bayar' },
    { to: '/track', icon: lucide_react_1.Search, label: 'Cek' },
    { to: '/my-bookings', icon: lucide_react_1.User, label: 'Saya' },
];
function BottomNav() {
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var pendingCount = (0, AppContext_1.useApp)().pendingCount;
    return ((0, jsx_runtime_1.jsx)("nav", { className: "md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-gray-200/60 safe-bottom", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-around px-1 py-1.5", children: items.map(function (_a) {
                var to = _a.to, Icon = _a.icon, label = _a.label;
                var active = pathname === to;
                return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: to, className: "relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors min-w-[52px]", children: [active && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { layoutId: "bottom-tab", className: "absolute inset-0 bg-purple-100 rounded-xl", transition: { type: 'spring', stiffness: 400, damping: 30 } })), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(Icon, { size: 20, strokeWidth: active ? 2.5 : 1.5, className: "relative z-10 transition-colors ".concat(active ? 'text-purple-700' : 'text-gray-400') }), to === '/track' && pendingCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white animate-pulse", children: pendingCount > 9 ? '9+' : pendingCount }))] }), (0, jsx_runtime_1.jsx)("span", { className: "relative z-10 text-[9px] font-medium transition-colors ".concat(active ? 'text-purple-700' : 'text-gray-400'), children: label })] }, to));
            }) }) }));
}
