"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrackPage;
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
    Pending: {
        label: 'Menunggu Konfirmasi', color: 'text-amber-700 bg-amber-50 border-amber-300',
        bar: 'bg-amber-400', icon: lucide_react_1.Clock, progress: 25,
        desc: 'Booking Anda telah diterima. Admin sedang memeriksa detail pesanan Anda.',
    },
    Confirmed: {
        label: 'Sedang Dikerjakan', color: 'text-blue-700 bg-blue-50 border-blue-300',
        bar: 'bg-blue-500', icon: lucide_react_1.Package, progress: 65,
        desc: 'Admin telah mengkonfirmasi pesanan Anda. Tugas sedang dalam pengerjaan.',
    },
    Completed: {
        label: 'Selesai', color: 'text-green-700 bg-green-50 border-green-300',
        bar: 'bg-green-500', icon: lucide_react_1.CheckCircle, progress: 100,
        desc: 'Tugas Anda telah selesai dan dikirimkan. Terima kasih telah menggunakan layanan kami!',
    },
    Cancelled: {
        label: 'Dibatalkan', color: 'text-red-700 bg-red-50 border-red-300',
        bar: 'bg-red-400', icon: lucide_react_1.XCircle, progress: 0,
        desc: 'Pesanan ini telah dibatalkan. Hubungi admin untuk informasi lebih lanjut.',
    },
};
var timeline = [
    { key: 'Pending', label: 'Booking Diterima', icon: lucide_react_1.ClipboardList },
    { key: 'Confirmed', label: 'Dikonfirmasi Admin', icon: lucide_react_1.CheckCircle },
    { key: 'Completed', label: 'Tugas Selesai', icon: lucide_react_1.Package },
];
function formatDate(iso) {
    return new Date(iso).toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}
function TimelineStep(_a) {
    var label = _a.label, Icon = _a.icon, active = _a.active, done = _a.done, cancelled = _a.cancelled;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center gap-1 flex-1", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: false, animate: { scale: active ? 1.1 : 1 }, className: "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ".concat(cancelled ? 'border-red-300 bg-red-50 text-red-400' : done || active ? 'border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-200' : 'border-gray-200 bg-white text-gray-300'), children: (0, jsx_runtime_1.jsx)(Icon, { size: 18 }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs font-semibold text-center leading-tight ".concat(cancelled ? 'text-red-400' : done || active ? 'text-purple-700' : 'text-gray-400'), children: label })] }));
}
function TrackPage() {
    var _a;
    var searchParams = (0, react_router_dom_1.useSearchParams)()[0];
    var initialId = searchParams.get('id') || '';
    var _b = (0, react_1.useState)(initialId), input = _b[0], setInput = _b[1];
    var _c = (0, react_1.useState)(null), booking = _c[0], setBooking = _c[1];
    var _d = (0, react_1.useState)(!!initialId), searched = _d[0], setSearched = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var handleSearch = function () {
        if (!input.trim()) {
            sonner_1.toast.error('Masukkan nomor booking');
            return;
        }
        setLoading(true);
        setTimeout(function () {
            var found = (0, storage_1.getBookingById)(input.trim().toUpperCase());
            setBooking(found);
            setSearched(true);
            setLoading(false);
            if (!found)
                sonner_1.toast.error('Booking tidak ditemukan');
            else
                sonner_1.toast.success('Booking ditemukan!');
        }, 600);
    };
    (0, react_1.useEffect)(function () {
        if (initialId) {
            setLoading(true);
            setTimeout(function () {
                var found = (0, storage_1.getBookingById)(initialId.trim().toUpperCase());
                setBooking(found);
                setSearched(true);
                setLoading(false);
            }, 600);
        }
    }, [initialId]);
    var cfg = booking ? statusConfig[booking.status] : null;
    var StatusIcon = (_a = cfg === null || cfg === void 0 ? void 0 : cfg.icon) !== null && _a !== void 0 ? _a : lucide_react_1.Clock;
    var orderIdx = { Pending: 0, Confirmed: 1, Completed: 2, Cancelled: -1 };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans", children: [(0, jsx_runtime_1.jsx)(GlassNavbar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-2xl mx-auto px-4 py-12", children: [(0, jsx_runtime_1.jsx)(ScrollReveal_1.default, { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-700 mb-6 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 14 }), "Kembali ke Beranda"] }) }), (0, jsx_runtime_1.jsx)(ScrollReveal_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 200 }, className: "w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { size: 26, className: "text-white" }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-extrabold text-gray-900 mb-2", children: "Lacak Status Order" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "Masukkan nomor booking untuk melihat progress tugas Anda" })] }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Nomor Booking" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ClipboardList, { size: 16, className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "BOOK-2026-001", value: input, onChange: function (e) { return setInput(e.target.value.toUpperCase()); }, onKeyDown: function (e) { return e.key === 'Enter' && handleSearch(); }, className: "w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 text-sm outline-none transition-all font-mono uppercase" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, onClick: handleSearch, disabled: loading || !input.trim(), className: "flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md shadow-purple-300", children: [loading ? (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { size: 16 }), "Cari"] })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-xs text-gray-400", children: "Nomor booking dikirim ke WhatsApp Anda saat order dibuat (format: BOOK-2026-XXX)" })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.AnimatePresence, { mode: "wait", children: [searched && !booking && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "bg-white rounded-2xl border border-red-100 shadow-md p-8 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { size: 28, className: "text-red-400" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-gray-800 mb-2", children: "Booking Tidak Ditemukan" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 mb-5", children: ["Nomor ", (0, jsx_runtime_1.jsx)("span", { className: "font-mono font-bold text-gray-700", children: input }), " tidak ditemukan."] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-3 justify-center", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/booking", className: "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 14 }), "Buat Booking Baru"] }), (0, jsx_runtime_1.jsxs)("a", { href: "https://wa.me/6281295991378", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 14 }), "Hubungi Admin"] })] })] }, "notfound")), searched && booking && cfg && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-5 border-b ".concat(booking.status === 'Completed' ? 'bg-green-50 border-green-100' : booking.status === 'Cancelled' ? 'bg-red-50 border-red-100' : booking.status === 'Confirmed' ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Nomor Booking" }), (0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ".concat(cfg.color), children: [(0, jsx_runtime_1.jsx)(StatusIcon, { size: 11 }), cfg.label] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-extrabold text-gray-900 tracking-wide font-mono", children: booking.id })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [booking.status !== 'Cancelled' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-xs text-gray-500 mb-1.5", children: [(0, jsx_runtime_1.jsx)("span", { children: "Progress" }), (0, jsx_runtime_1.jsxs)("span", { children: [cfg.progress, "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2.5 bg-gray-100 rounded-full overflow-hidden", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { width: 0 }, animate: { width: "".concat(cfg.progress, "%") }, transition: { duration: 1, ease: 'easeOut' }, className: "h-full rounded-full ".concat(cfg.bar) }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-2xl border text-sm ".concat(cfg.color), children: [(0, jsx_runtime_1.jsx)(StatusIcon, { size: 16, className: "inline mr-2" }), cfg.desc] }), booking.status !== 'Cancelled' && ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200" }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex gap-2", children: timeline.map(function (_a, i) {
                                                            var key = _a.key, label = _a.label, icon = _a.icon;
                                                            var currentIdx = orderIdx[booking.status];
                                                            return ((0, jsx_runtime_1.jsx)(TimelineStep, { label: label, icon: icon, active: currentIdx === i, done: currentIdx > i, cancelled: booking.status === 'Cancelled' }, key));
                                                        }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: [
                                                    { label: 'Nama', val: booking.nama },
                                                    { label: 'Jenis Tugas', val: booking.jenistugas },
                                                    { label: 'Urgensi', val: booking.urgensi },
                                                    { label: 'Harga', val: "Rp ".concat(booking.harga.toLocaleString('id-ID')) },
                                                    { label: 'Deadline', val: formatDate(booking.deadline) },
                                                    { label: 'Dipesan', val: formatDate(booking.createdAt) },
                                                ].map(function (_a) {
                                                    var label = _a.label, val = _a.val;
                                                    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.02 }, className: "bg-gray-50 rounded-xl p-3 transition-all", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-400 mb-0.5", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-semibold text-gray-800", children: val })] }, label));
                                                }) }), booking.alasanBatal && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold mb-1", children: "Alasan Pembatalan" }), (0, jsx_runtime_1.jsx)("p", { children: booking.alasanBatal })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.a, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, href: "https://wa.me/6281295991378?text=Halo%2C%20saya%20ingin%20menanyakan%20status%20booking%20".concat(booking.id), target: "_blank", rel: "noopener noreferrer", className: "flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold py-3 rounded-xl text-sm transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 15 }), "Tanya Admin"] }), booking.status === 'Cancelled' && ((0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/booking", className: "flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 15 }), "Buat Booking Baru"] }))] })] })] }, "found"))] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.a, { href: "https://wa.me/6281295991378", target: "_blank", rel: "noopener noreferrer", initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.5, type: 'spring' }, whileHover: { scale: 1.08 }, whileTap: { scale: 0.95 }, className: "fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold px-4 py-3 rounded-2xl shadow-2xl transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { size: 20, className: "shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm hidden sm:block", children: "Chat Admin" })] })] }));
}
