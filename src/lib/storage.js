"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.DEFAULT_CATALOG = void 0;
exports.getCatalog = getCatalog;
exports.saveCatalog = saveCatalog;
exports.resetCatalog = resetCatalog;
exports.generateBookingId = generateBookingId;
exports.getAllBookings = getAllBookings;
exports.saveBooking = saveBooking;
exports.updateBookingStatus = updateBookingStatus;
exports.getBookingById = getBookingById;
exports.getBookingsByWhatsApp = getBookingsByWhatsApp;
exports.deleteBooking = deleteBooking;
exports.exportToCSV = exportToCSV;
var BOOKINGS_KEY = 'jtk_bookings';
var COUNTER_KEY = 'jtk_counter';
var CATALOG_KEY = 'jtk_catalog';
exports.DEFAULT_CATALOG = [
    { id: 'makalah', label: 'Makalah', desc: 'Makalah & essay akademik', basePrice: 6000, fixed: false, unit: 'halaman', active: true },
    { id: 'ppt', label: 'PPT', desc: 'Presentasi PowerPoint', basePrice: 5000, fixed: false, unit: 'slide', active: true },
    { id: 'coding', label: 'Coding', desc: 'Web, mobile & algoritma', basePrice: 50000, fixed: true, unit: 'proyek', active: true },
    { id: 'desain', label: 'Desain', desc: 'Desain grafis & UI/UX', basePrice: 25000, fixed: true, unit: 'desain', active: true },
    { id: 'jurnal', label: 'Jurnal', desc: 'Jurnal & artikel ilmiah', basePrice: 8000, fixed: false, unit: 'halaman', active: true },
    { id: 'proposal', label: 'Proposal', desc: 'Skripsi, tesis & proposal', basePrice: 7000, fixed: false, unit: 'halaman', active: true },
    { id: 'lainnya', label: 'Lainnya', desc: 'Tugas lain (nego langsung)', basePrice: 5000, fixed: false, unit: 'halaman', active: true },
];
function getCatalog() {
    if (typeof window === 'undefined')
        return exports.DEFAULT_CATALOG;
    try {
        var raw = localStorage.getItem(CATALOG_KEY);
        if (!raw)
            return exports.DEFAULT_CATALOG;
        var parsed = JSON.parse(raw);
        return parsed.length ? parsed : exports.DEFAULT_CATALOG;
    }
    catch (_a) {
        return exports.DEFAULT_CATALOG;
    }
}
function saveCatalog(items) {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(items));
}
function resetCatalog() {
    localStorage.removeItem(CATALOG_KEY);
}
function getCounter() {
    if (typeof window === 'undefined')
        return 1;
    var val = localStorage.getItem(COUNTER_KEY);
    return val ? parseInt(val, 10) : 1;
}
function incrementCounter() {
    var next = getCounter() + 1;
    localStorage.setItem(COUNTER_KEY, String(next));
    return next;
}
function generateBookingId() {
    var year = new Date().getFullYear();
    var counter = getCounter();
    var padded = String(counter).padStart(3, '0');
    return "BOOK-".concat(year, "-").concat(padded);
}
function getAllBookings() {
    if (typeof window === 'undefined')
        return [];
    try {
        var raw = localStorage.getItem(BOOKINGS_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
function saveBooking(booking) {
    var all = getAllBookings();
    all.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    incrementCounter();
}
function updateBookingStatus(id, status, extra) {
    var all = getAllBookings();
    var idx = all.findIndex(function (b) { return b.id === id; });
    if (idx === -1)
        return false;
    all[idx] = __assign(__assign(__assign({}, all[idx]), { status: status, updatedAt: new Date().toISOString() }), extra);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    return true;
}
function getBookingById(id) {
    var _a;
    return (_a = getAllBookings().find(function (b) { return b.id === id; })) !== null && _a !== void 0 ? _a : null;
}
function getBookingsByWhatsApp(wa) {
    var clean = wa.replace(/\D/g, '');
    return getAllBookings().filter(function (b) { return b.whatsapp.replace(/\D/g, '').includes(clean); });
}
function deleteBooking(id) {
    var all = getAllBookings();
    var filtered = all.filter(function (b) { return b.id !== id; });
    if (filtered.length === all.length)
        return false;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(filtered));
    return true;
}
function exportToCSV(bookings) {
    var headers = [
        'Nomor Booking',
        'Nama',
        'WhatsApp',
        'Jenis Tugas',
        'Detail',
        'Deadline',
        'Urgensi',
        'Harga',
        'Status',
        'Catatan',
        'Dibuat',
        'Diupdate',
    ];
    var rows = bookings.map(function (b) {
        var _a;
        return [
            b.id,
            b.nama,
            b.whatsapp,
            b.jenistugas,
            "\"".concat(b.detail.replace(/"/g, '""'), "\""),
            new Date(b.deadline).toLocaleString('id-ID'),
            b.urgensi,
            b.harga,
            b.status,
            "\"".concat(((_a = b.catatan) !== null && _a !== void 0 ? _a : '').replace(/"/g, '""'), "\""),
            new Date(b.createdAt).toLocaleString('id-ID'),
            new Date(b.updatedAt).toLocaleString('id-ID'),
        ].join(',');
    });
    return __spreadArray([headers.join(',')], rows, true).join('\n');
}
