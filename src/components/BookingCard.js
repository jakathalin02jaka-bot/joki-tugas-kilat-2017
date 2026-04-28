"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BookingCard;
var jsx_runtime_1 = require("react/jsx-runtime");
var StatusBadge_1 = require("./StatusBadge");
var lucide_react_1 = require("lucide-react");
var urgencyColor = {
    Normal: 'text-green-600',
    Urgent: 'text-orange-500',
    Express: 'text-red-600',
};
function BookingCard(_a) {
    var booking = _a.booking, actions = _a.actions;
    var deadline = new Date(booking.deadline);
    var now = new Date();
    var hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
    var isOverdue = deadline < now && booking.status !== 'Completed';
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-center justify-between gap-3 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 font-medium", children: "Nomor Booking" }), (0, jsx_runtime_1.jsx)("p", { className: "font-bold text-purple-700 text-sm tracking-wide", children: booking.id })] }), (0, jsx_runtime_1.jsx)(StatusBadge_1.default, { status: booking.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-4 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-gray-800 text-base", children: booking.nama }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium", children: booking.jenistugas })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 line-clamp-2", children: booking.detail }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 13, className: "text-purple-400 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: isOverdue ? 'text-red-500 font-medium' : '', children: deadline.toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { size: 13, className: "text-purple-400 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: isOverdue ? 'text-red-500 font-medium' : '', children: isOverdue
                                            ? 'Lewat deadline'
                                            : hoursLeft < 24
                                                ? "".concat(hoursLeft, " jam lagi")
                                                : "".concat(Math.ceil(hoursLeft / 24), " hari lagi") })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 13, className: "shrink-0 ".concat(urgencyColor[booking.urgensi]) }), (0, jsx_runtime_1.jsx)("span", { className: urgencyColor[booking.urgensi], children: booking.urgensi })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Banknote, { size: 13, className: "text-green-500 shrink-0" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium text-gray-700", children: new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                        }).format(booking.harga) })] })] }), booking.catatan && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-1.5 bg-gray-50 rounded-lg px-3 py-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { size: 13, className: "text-gray-400 shrink-0 mt-0.5" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 line-clamp-2", children: booking.catatan })] }))] }), actions && (0, jsx_runtime_1.jsx)("div", { className: "px-5 py-3 border-t border-gray-100 bg-gray-50", children: actions })] }));
}
