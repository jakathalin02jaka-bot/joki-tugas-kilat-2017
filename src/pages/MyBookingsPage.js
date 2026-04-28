"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyBookingsPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
var GlassNavbar_1 = require("../components/GlassNavbar");
var ScrollReveal_1 = require("../components/ScrollReveal");
var storage_1 = require("../lib/storage");
var lucide_react_1 = require("lucide-react");
var statusConfig = {
    Pending: { label: 'Menunggu', icon: lucide_react_1.Clock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
    Confirmed: { label: 'Dikerjakan', icon: lucide_react_1.Package, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
    Completed: { label: 'Selesai', icon: lucide_react_1.CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
    Cancelled: { label: 'Dibatalkan', icon: lucide_react_1.XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
};
var statusFilters = [
    { value: 'all', label: 'Semua' },
    { value: 'Pending', label: 'Menunggu' },
    { value: 'Confirmed', label: 'Dikerjakan' },
    { value: 'Completed', label: 'Selesai' },
    { value: 'Cancelled', label: 'Dibatalkan' },
];
function formatDeadlineCountdown(deadline) {
    var diff = new Date(deadline).getTime() - Date.now();
    if (diff < 0)
        return { label: 'Sudah lewat', urgent: true };
    var hours = Math.floor(diff / 3600000);
    if (hours < 24)
        return { label: "".concat(hours, " jam lagi"), urgent: true };
    var days = Math.floor(hours / 24);
    return { label: "".concat(days, " hari lagi"), urgent: days <= 2 };
}
function BookingItem(_a) {
    var booking = _a.booking;
    var cfg = statusConfig[booking.status];
    var StatusIcon = cfg.icon;
    var countdown = formatDeadlineCountdown(booking.deadline);
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { layout: true, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, whileHover: { y: -3 }, transition: { type: 'spring', stiffness: 300 }, className: "bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-1 w-full ".concat(booking.status === 'Completed' ? 'bg-green-400' : booking.status === 'Confirmed' ? 'bg-blue-400' : booking.status === 'Cancelled' ? 'bg-red-400' : 'bg-amber-400') }), (0, jsx_runtime_1.jsxs)("div", { className: "p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between gap-3 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-mono text-xs text-gray-400 mb-0.5", children: booking.id }), (0, jsx_runtime_1.jsx)("p", { className: "font-bold text-gray-900", children: booking.jenistugas })] }), (0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ".concat(cfg.bg, " ").concat(cfg.text, " ").concat(cfg.border), children: [(0, jsx_runtime_1.jsx)(StatusIcon, { size: 11 }), cfg.label] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2", children: booking.detail }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-xl p-2.5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-gray-400 mb-0.5", children: "Harga" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs font-bold text-gray-800", children: ["Rp ", booking.harga.toLocaleString('id-ID')] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-xl p-2.5", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-gray-400 mb-0.5", children: "Urgensi" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-bold text-gray-800", children: booking.urgensi })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-xl p-2.5 ".concat(countdown.urgent && booking.status !== 'Completed' && booking.status !== 'Cancelled' ? 'bg-red-50' : 'bg-gray-50'), children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] text-gray-400 mb-0.5", children: "Deadline" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-bold ".concat(countdown.urgent && booking.status !== 'Completed' && booking.status !== 'Cancelled' ? 'text-red-600' : 'text-gray-800'), children: countdown.label })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 pt-3 border-t border-gray-100", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/track?id=".concat(booking.id), className: "flex-1 flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-2 rounded-xl text-xs transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ClipboardList, { size: 13 }), "Detail"] }), (0, jsx_runtime_1.jsxs)("a", { href: "https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20menanyakan%20booking%20".concat(booking.id), target: "_blank", rel: "noopener noreferrer", className: "flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2 rounded-xl text-xs transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 13 }), "Tanya Admin"] })] })] })] }));
}
function MyBookingsPage() {
    var _a, _b, _c;
    var _d = (0, react_1.useState)(''), wa = _d[0], setWa = _d[1];
    var _e = (0, react_1.useState)(false), searched = _e[0], setSearched = _e[1];
    var _f = (0, react_1.useState)([]), bookings = _f[0], setBookings = _f[1];
    var _g = (0, react_1.useState)('all'), activeFilter = _g[0], setActiveFilter = _g[1];
    var _h = (0, react_1.useState)(false), loading = _h[0], setLoading = _h[1];
    var filtered = activeFilter === 'all' ? bookings : bookings.filter(function (b) { return b.status === activeFilter; });
    var statusCounts = bookings.reduce(function (acc, b) {
        var _a;
        acc[b.status] = ((_a = acc[b.status]) !== null && _a !== void 0 ? _a : 0) + 1;
        return acc;
    }, {});
    function handleSearch() {
        if (!wa.trim()) {
            sonner_1.toast.error('Masukkan nomor WhatsApp');
            return;
        }
        setLoading(true);
        setTimeout(function () {
            var results = (0, storage_1.getBookingsByWhatsApp)(wa);
            var sorted = __spreadArray([], results, true).sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); });
            setBookings(sorted);
            setSearched(true);
            setLoading(false);
            if (sorted.length === 0)
                sonner_1.toast.info('Tidak ada booking ditemukan untuk nomor ini');
            else
                sonner_1.toast.success("".concat(sorted.length, " booking ditemukan!"));
        }, 500);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans", children: [(0, jsx_runtime_1.jsx)(GlassNavbar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto px-4 py-10", children: [(0, jsx_runtime_1.jsx)(ScrollReveal_1.default, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 mb-6 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 14 }), "Kembali ke Beranda"] }) }), (0, jsx_runtime_1.jsx)(ScrollReveal_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 200 }, className: "w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ClipboardList, { size: 26, className: "text-white" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-extrabold text-gray-900 mb-2", children: "Booking Saya" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "Masukkan nomor WhatsApp untuk melihat semua pesanan Anda" })] }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Nomor WhatsApp" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { size: 16, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "tel", placeholder: "08xxxxxxxxxx", value: wa, onChange: function (e) { return setWa(e.target.value); }, onKeyDown: function (e) { return e.key === 'Enter' && handleSearch(); }, className: "w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 text-sm outline-none transition-all" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, onClick: handleSearch, disabled: loading || !wa.trim(), className: "flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-300", children: [loading ? (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { size: 16 }), "Cari"] })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.AnimatePresence, { mode: "wait", children: [searched && bookings.length === 0 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, className: "bg-white rounded-2xl border border-gray-200 shadow-md p-10 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 28, className: "text-gray-300" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-gray-700 mb-2", children: "Tidak ada booking ditemukan" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 mb-6", children: "Nomor WhatsApp ini belum memiliki riwayat booking" }), (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/booking", className: "inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 15 }), "Buat Booking Pertama"] })] }, "empty")), searched && bookings.length > 0 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6", children: [
                                            { label: 'Total', val: bookings.length, color: 'from-purple-500 to-indigo-500' },
                                            { label: 'Menunggu', val: (_a = statusCounts['Pending']) !== null && _a !== void 0 ? _a : 0, color: 'from-amber-400 to-orange-400' },
                                            { label: 'Dikerjakan', val: (_b = statusCounts['Confirmed']) !== null && _b !== void 0 ? _b : 0, color: 'from-blue-500 to-cyan-400' },
                                            { label: 'Selesai', val: (_c = statusCounts['Completed']) !== null && _c !== void 0 ? _c : 0, color: 'from-green-500 to-emerald-400' },
                                        ].map(function (_a, i) {
                                            var label = _a.label, val = _a.val, color = _a.color;
                                            return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.1 }, whileHover: { scale: 1.03 }, className: "bg-white rounded-2xl border border-gray-200 p-4 text-center shadow-sm", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-extrabold bg-gradient-to-r ".concat(color, " bg-clip-text text-transparent"), children: val }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-0.5", children: label })] }, label));
                                        }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2 overflow-x-auto pb-1 mb-5", children: statusFilters.map(function (_a) {
                                            var value = _a.value, label = _a.label;
                                            return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: function () { return setActiveFilter(value); }, className: "shrink-0 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ".concat(activeFilter === value
                                                    ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-200'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-purple-300'), children: [label, value !== 'all' && statusCounts[value] ? " (".concat(statusCounts[value], ")") : ''] }, value));
                                        }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { mode: "wait", children: filtered.length === 0 ? ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "text-center py-12 text-gray-400 text-sm", children: "Tidak ada booking dengan status ini" }, "nofilter")) : ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: filtered.map(function (b) { return ((0, jsx_runtime_1.jsx)(BookingItem, { booking: b }, b.id)); }) }, "grid")) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 text-center", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/booking", className: "inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-300", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 15 }), "Buat Booking Baru"] }) })] }, "results"))] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.a, { href: "https://wa.me/6281295991378", target: "_blank", rel: "noopener noreferrer", initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.5, type: 'spring' }, whileHover: { scale: 1.08 }, whileTap: { scale: 0.95 }, className: "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-3 rounded-2xl shadow-2xl transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 20, className: "shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm hidden sm:block", children: "Chat Admin" })] })] }));
}
