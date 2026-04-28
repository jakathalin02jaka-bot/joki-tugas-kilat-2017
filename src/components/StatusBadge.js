"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatusBadge;
var jsx_runtime_1 = require("react/jsx-runtime");
var config = {
    Pending: {
        label: 'Menunggu',
        className: 'bg-amber-100 text-amber-700 border border-amber-200',
    },
    Confirmed: {
        label: 'Dikonfirmasi',
        className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    Completed: {
        label: 'Selesai',
        className: 'bg-green-100 text-green-700 border border-green-200',
    },
    Cancelled: {
        label: 'Dibatalkan',
        className: 'bg-red-100 text-red-700 border border-red-200',
    },
};
function StatusBadge(_a) {
    var status = _a.status;
    var _b = config[status], label = _b.label, className = _b.className;
    return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ".concat(className), children: label }));
}
