"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var HomePage_1 = require("./pages/HomePage");
var BookingPage_1 = require("./pages/BookingPage");
var TrackPage_1 = require("./pages/TrackPage");
var MyBookingsPage_1 = require("./pages/MyBookingsPage");
var AdminPage_1 = require("./pages/AdminPage");
var PaymentPage_1 = require("./pages/PaymentPage");
var ScrollProgress_1 = require("./components/ScrollProgress");
var BackToTop_1 = require("./components/BackToTop");
var BottomNav_1 = require("./components/BottomNav");
var pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
};
function AnimatedPage(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { variants: pageVariants, initial: "initial", animate: "animate", exit: "exit", transition: { duration: 0.3, ease: 'easeOut' }, children: children }));
}
function App() {
    var location = (0, react_router_dom_1.useLocation)();
    var isAdmin = location.pathname === '/admin';
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ScrollProgress_1.default, {}), (0, jsx_runtime_1.jsx)(BackToTop_1.default, {}), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { location: location, children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsx)(AnimatedPage, { children: (0, jsx_runtime_1.jsx)(HomePage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/booking", element: (0, jsx_runtime_1.jsx)(AnimatedPage, { children: (0, jsx_runtime_1.jsx)(BookingPage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/track", element: (0, jsx_runtime_1.jsx)(AnimatedPage, { children: (0, jsx_runtime_1.jsx)(TrackPage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/my-bookings", element: (0, jsx_runtime_1.jsx)(AnimatedPage, { children: (0, jsx_runtime_1.jsx)(MyBookingsPage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/admin", element: (0, jsx_runtime_1.jsx)(AnimatedPage, { children: (0, jsx_runtime_1.jsx)(AdminPage_1.default, {}) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/payment", element: (0, jsx_runtime_1.jsx)(AnimatedPage, { children: (0, jsx_runtime_1.jsx)(PaymentPage_1.default, {}) }) })] }, location.pathname) }), !isAdmin && (0, jsx_runtime_1.jsx)(BottomNav_1.default, {})] }));
}
exports.default = App;
