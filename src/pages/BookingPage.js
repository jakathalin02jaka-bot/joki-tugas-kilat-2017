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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BookingPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
var GlassNavbar_1 = require("../components/GlassNavbar");
var ScrollReveal_1 = require("../components/ScrollReveal");
var storage_1 = require("../lib/storage");
var whatsapp_1 = require("../lib/whatsapp");
var PaymentInfo_1 = require("../components/PaymentInfo");
var lucide_react_1 = require("lucide-react");
var DRAFT_KEY = 'jtk_booking_draft';
var defaultForm = {
    nama: '', whatsapp: '', jenistugas: '', detail: '',
    deadline: '', urgensi: 'Normal', harga: '', catatan: '',
};
var taskTypes = [
    { value: 'Makalah', icon: lucide_react_1.BookOpen, desc: 'Akademik', base: 6000, fixed: false },
    { value: 'PPT', icon: lucide_react_1.PresentationIcon, desc: 'Presentasi', base: 5000, fixed: false },
    { value: 'Coding', icon: lucide_react_1.Code, desc: 'Coding', base: 50000, fixed: true },
    { value: 'Desain', icon: lucide_react_1.Palette, desc: 'Desain', base: 25000, fixed: true },
    { value: 'Jurnal', icon: lucide_react_1.FileText, desc: 'Jurnal', base: 8000, fixed: false },
    { value: 'Proposal', icon: lucide_react_1.BookMarked, desc: 'Proposal', base: 7000, fixed: false },
    { value: 'Lainnya', icon: lucide_react_1.MoreHorizontal, desc: 'Lainnya', base: 5000, fixed: false },
];
var urgencyOptions = [
    { value: 'Normal', label: 'Normal', desc: '> 3 hari', multiplier: 1.0 },
    { value: 'Urgent', label: 'Urgent', desc: '1-3 hari', multiplier: 1.4 },
    { value: 'Express', label: 'Express', desc: '< 24 jam', multiplier: 1.8 },
];
function estimatePrice(jenistugas, urgensi, hargaInput) {
    var _a, _b;
    if (hargaInput && !isNaN(Number(hargaInput)))
        return Number(hargaInput);
    var mult = (_b = (_a = urgencyOptions.find(function (u) { return u.value === urgensi; })) === null || _a === void 0 ? void 0 : _a.multiplier) !== null && _b !== void 0 ? _b : 1;
    var task = taskTypes.find(function (t) { return t.value === jenistugas; });
    if (!task)
        return null;
    var units = task.fixed ? 1 : 10;
    return Math.round(task.base * units * mult);
}
/** Scroll to element and focus it */
function scrollToField(ref) {
    if (!ref.current)
        return;
    var y = ref.current.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    setTimeout(function () { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus(); }, 350);
}
function BookingPage() {
    var _a = (0, react_1.useState)(1), step = _a[0], setStep = _a[1];
    var _b = (0, react_1.useState)(defaultForm), form = _b[0], setForm = _b[1];
    var _c = (0, react_1.useState)({}), errors = _c[0], setErrors = _c[1];
    var _d = (0, react_1.useState)(false), submitted = _d[0], setSubmitted = _d[1];
    var _e = (0, react_1.useState)(null), bookingResult = _e[0], setBookingResult = _e[1];
    var _f = (0, react_1.useState)(false), copied = _f[0], setCopied = _f[1];
    var bookingId = (0, react_1.useState)(function () { return (0, storage_1.generateBookingId)(); })[0];
    // Field refs for auto-focus
    var namaRef = (0, react_1.useRef)(null);
    var waRef = (0, react_1.useRef)(null);
    var detailRef = (0, react_1.useRef)(null);
    var deadlineRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        try {
            var draft = localStorage.getItem(DRAFT_KEY);
            if (draft)
                setForm(JSON.parse(draft));
        }
        catch ( /* ignore */_a) { /* ignore */ }
    }, []);
    (0, react_1.useEffect)(function () {
        if (!submitted) {
            try {
                localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
            }
            catch ( /* ignore */_a) { /* ignore */ }
        }
    }, [form, submitted]);
    var setField = function (field, value) {
        setForm(function (p) {
            var _a;
            return (__assign(__assign({}, p), (_a = {}, _a[field] = value, _a)));
        });
        setErrors(function (p) { var e = __assign({}, p); delete e[field]; return e; });
    };
    var validateStep = (0, react_1.useCallback)(function (s) {
        var e = {};
        if (s === 1) {
            if (!form.nama.trim())
                e.nama = 'Isi nama lengkap Anda';
            if (!form.whatsapp.trim())
                e.whatsapp = 'Isi nomor WhatsApp';
            else if (!/^(\+62|62|0)[0-9]{8,13}$/.test(form.whatsapp.replace(/\s/g, ''))) {
                e.whatsapp = 'Format tidak valid. Contoh: 081295991378';
            }
            if (!form.jenistugas)
                e.jenistugas = 'Pilih jenis tugas';
        }
        if (s === 2) {
            if (!form.detail.trim() || form.detail.trim().length < 10)
                e.detail = 'Jelaskan detail tugas (min 10 huruf)';
            if (!form.deadline)
                e.deadline = 'Pilih deadline';
            else {
                var dl = new Date(form.deadline);
                if (dl.getTime() <= Date.now())
                    e.deadline = 'Deadline harus di masa depan';
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }, [form]);
    var goNext = function () {
        if (!validateStep(step)) {
            // Auto-focus first error field
            sonner_1.toast.error('Periksa form Anda', { description: 'Isi field yang bertanda merah' });
            var firstErrKey_1 = Object.keys(errors)[0] || (step === 1
                ? (!form.nama ? 'nama' : !form.whatsapp ? 'whatsapp' : !form.jenistugas ? 'jenistugas' : 'nama')
                : (!form.detail ? 'detail' : !form.deadline ? 'deadline' : 'detail'));
            setTimeout(function () {
                if (firstErrKey_1 === 'nama' && namaRef.current)
                    scrollToField(namaRef);
                else if (firstErrKey_1 === 'whatsapp' && waRef.current)
                    scrollToField(waRef);
                else if (firstErrKey_1 === 'jenistugas') {
                    var el = document.getElementById('task-grid');
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.focus();
                    }
                }
                else if (firstErrKey_1 === 'detail' && detailRef.current)
                    scrollToField(detailRef);
                else if (firstErrKey_1 === 'deadline' && deadlineRef.current)
                    scrollToField(deadlineRef);
            }, 100);
            return;
        }
        setStep(function (s) { return s + 1; });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    var goPrev = function () {
        setStep(function (s) { return s - 1; });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    var handleSubmit = function () {
        var est = estimatePrice(form.jenistugas, form.urgensi, form.harga);
        var booking = {
            id: bookingId,
            nama: form.nama.trim(),
            whatsapp: form.whatsapp.trim(),
            jenistugas: form.jenistugas,
            detail: form.detail.trim(),
            deadline: new Date(form.deadline).toISOString(),
            urgensi: form.urgensi,
            harga: est !== null && est !== void 0 ? est : 0,
            catatan: form.catatan.trim(),
            status: 'Pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        (0, storage_1.saveBooking)(booking);
        setBookingResult(booking);
        setSubmitted(true);
        try {
            localStorage.removeItem(DRAFT_KEY);
        }
        catch ( /* ignore */_a) { /* ignore */ }
        sonner_1.toast.success('Booking berhasil!', { description: "Nomor: ".concat(bookingId) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    var estPrice = estimatePrice(form.jenistugas, form.urgensi, form.harga);
    // ── SUCCESS SCREEN ──
    if (submitted && bookingResult) {
        var waLink = (0, whatsapp_1.getAdminWaLink)((0, whatsapp_1.buildBookingMessage)(bookingResult));
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans", children: [(0, jsx_runtime_1.jsx)(GlassNavbar_1.default, {}), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, className: "max-w-lg mx-auto px-4 py-8 md:py-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-r from-purple-600 to-indigo-600 p-6 md:p-8 text-center text-white", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 200, delay: 0.2 }, className: "w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 32, className: "text-white md:hidden" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 40, className: "text-white hidden md:block" })] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-xl md:text-2xl font-extrabold mb-1", children: "Booking Berhasil!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-purple-200 text-sm", children: "Admin akan segera menghubungi Anda" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 md:p-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center p-3 md:p-4 bg-purple-50 rounded-2xl border border-purple-200", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mb-1", children: "Nomor Booking" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl md:text-2xl font-extrabold text-purple-700 tracking-wider", children: bookingResult.id }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileTap: { scale: 0.95 }, onClick: function () { navigator.clipboard.writeText(bookingResult.id); setCopied(true); sonner_1.toast.success('Disalin!'); setTimeout(function () { return setCopied(false); }, 2000); }, className: "mt-2 inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { size: 12 }), copied ? 'Tersalin!' : 'Salin nomor'] })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm", children: [{ label: 'Nama', val: bookingResult.nama }, { label: 'WhatsApp', val: bookingResult.whatsapp }, { label: 'Jenis', val: bookingResult.jenistugas }, { label: 'Urgensi', val: bookingResult.urgensi }, { label: 'Deadline', val: new Date(bookingResult.deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) }, { label: 'Est. Harga', val: "Rp ".concat(bookingResult.harga.toLocaleString('id-ID')) }].map(function (_a) {
                                            var label = _a.label, val = _a.val;
                                            return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-xl p-2.5 md:p-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] md:text-xs text-gray-400 mb-0.5", children: label }), (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-gray-800 truncate", children: val })] }, label));
                                        }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.a, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, href: waLink, target: "_blank", rel: "noopener noreferrer", className: "w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { size: 16 }), "Konfirmasi ke WhatsApp"] }), (0, jsx_runtime_1.jsx)("div", { className: "my-4 md:my-6", children: (0, jsx_runtime_1.jsx)(PaymentInfo_1.PaymentPageInline, {}) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 md:gap-3", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/my-bookings", className: "flex-1 flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold py-3 rounded-xl text-xs md:text-sm transition-colors", children: "Lihat Booking" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-xs md:text-sm transition-colors", children: "Beranda" })] })] })] }) })] }));
    }
    // ── MAIN FORM ──
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white font-sans", children: [(0, jsx_runtime_1.jsx)(GlassNavbar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "max-w-5xl mx-auto px-3 md:px-4 py-4 md:py-10", children: [(0, jsx_runtime_1.jsx)(ScrollReveal_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-4 md:mb-8", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "inline-flex items-center gap-1.5 text-xs md:text-sm text-gray-500 hover:text-purple-700 mb-3 md:mb-4 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 14 }), "Kembali"] }), (0, jsx_runtime_1.jsx)("h1", { className: "text-xl md:text-3xl font-extrabold text-gray-900 mb-1 md:mb-2", children: "Form Booking Tugas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs md:text-sm text-gray-500", children: "Isi data di bawah, admin merespons < 5 menit" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-8 px-1", children: [{ icon: lucide_react_1.Zap, label: 'Respons &lt; 5 mnt', color: 'text-yellow-600 bg-yellow-50' }, { icon: lucide_react_1.Shield, label: 'Original', color: 'text-blue-600 bg-blue-50' }, { icon: lucide_react_1.Star, label: 'Revisi Gratis', color: 'text-purple-600 bg-purple-50' }, { icon: lucide_react_1.Clock, label: 'On-Time', color: 'text-green-600 bg-green-50' }].map(function (_a) {
                            var Icon = _a.icon, label = _a.label, color = _a.color;
                            return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2 }, className: "flex items-center gap-1.5 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold ".concat(color), children: [(0, jsx_runtime_1.jsx)(Icon, { size: 12 }), label] }, label));
                        }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid md:grid-cols-[1fr_300px] gap-4 md:gap-6 items-start", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "bg-white rounded-2xl md:rounded-3xl shadow-lg border border-purple-100 overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-3 md:p-6 border-b border-gray-100", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1 md:gap-2", children: [{ n: 1, label: 'Data' }, { n: 2, label: 'Detail' }, { n: 3, label: 'Cek' }].map(function (_a, i) {
                                                var n = _a.n, label = _a.label;
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 md:gap-2 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 md:gap-2 shrink-0", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { backgroundColor: step > n ? '#22c55e' : step === n ? '#9333ea' : '#f3f4f6', color: step > n || step === n ? '#fff' : '#9ca3af' }, className: "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold shadow-sm", children: step > n ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 12, className: "md:hidden" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 16, className: "hidden md:block" })] })) : ((0, jsx_runtime_1.jsx)("span", { children: n })) }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] md:text-xs font-semibold hidden sm:block ".concat(step === n ? 'text-purple-700' : 'text-gray-400'), children: label })] }), i < 2 && (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { backgroundColor: step > n ? '#86efac' : '#e5e7eb' }, className: "flex-1 h-0.5 rounded-full mx-0.5 md:mx-1" })] }, n));
                                            }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 md:p-8", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.AnimatePresence, { mode: "wait", children: [step === 1 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.25 }, className: "space-y-4 md:space-y-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-base md:text-lg font-bold text-gray-900 mb-0.5", children: "Data Diri" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs md:text-sm text-gray-500", children: "Informasi kontak untuk koordinasi" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5", children: ["Nama Lengkap ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { ref: namaRef, type: "text", placeholder: "Contoh: Rina Sari", value: form.nama, onChange: function (e) { return setField('nama', e.target.value); }, className: "w-full pl-9 pr-3 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none transition-all ".concat(errors.nama ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-purple-400 bg-white hover:border-gray-300') })] }), errors.nama && (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 10 }), errors.nama] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5", children: ["Nomor WhatsApp ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { ref: waRef, type: "tel", inputMode: "tel", placeholder: "081295991378", value: form.whatsapp, onChange: function (e) { return setField('whatsapp', e.target.value); }, className: "w-full pl-9 pr-3 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none transition-all ".concat(errors.whatsapp ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-purple-400 bg-white hover:border-gray-300') })] }), errors.whatsapp && (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 10 }), errors.whatsapp] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-0.5 text-[10px] md:text-xs text-gray-400", children: "Format: 08xxxxxxxxxx" })] }), (0, jsx_runtime_1.jsxs)("div", { id: "task-grid", tabIndex: -1, children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2", children: ["Jenis Tugas ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1.5 md:gap-2", children: taskTypes.map(function (_a) {
                                                                            var value = _a.value, Icon = _a.icon;
                                                                            return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { type: "button", whileTap: { scale: 0.95 }, onClick: function () { return setField('jenistugas', value); }, className: "flex flex-col items-center gap-0.5 md:gap-1 p-2 md:p-3 rounded-xl border-2 text-center transition-all ".concat(form.jenistugas === value ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-purple-300'), children: [(0, jsx_runtime_1.jsx)(Icon, { size: 16, className: "md:size-18" }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] md:text-xs font-bold leading-tight", children: value })] }, value));
                                                                        }) }), errors.jenistugas && (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 10 }), errors.jenistugas] })] })] }, "step1")), step === 2 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.25 }, className: "space-y-4 md:space-y-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-base md:text-lg font-bold text-gray-900 mb-0.5", children: "Detail Tugas" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs md:text-sm text-gray-500", children: "Semakin detail, semakin bagus hasilnya" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5", children: ["Deskripsi Tugas ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("textarea", { ref: detailRef, placeholder: "Contoh: Makalah 15 halaman tentang perubahan iklim, format APA, daftar pustaka 10 sumber...", value: form.detail, onChange: function (e) { return setField('detail', e.target.value); }, rows: 4, className: "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none resize-none transition-all ".concat(errors.detail ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-purple-400 bg-white hover:border-gray-300') }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between mt-0.5", children: [errors.detail ? (0, jsx_runtime_1.jsxs)("p", { className: "text-[11px] md:text-xs text-red-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 10 }), errors.detail] }) : (0, jsx_runtime_1.jsx)("p", { className: "text-[10px] md:text-xs text-gray-400", children: "Min 10 huruf" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[10px] md:text-xs ".concat(form.detail.length < 10 ? 'text-red-400' : 'text-green-500'), children: [form.detail.length, " huruf"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5", children: ["Deadline ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" }), (0, jsx_runtime_1.jsx)("input", { ref: deadlineRef, type: "datetime-local", value: form.deadline, onChange: function (e) { return setField('deadline', e.target.value); }, className: "w-full pl-9 pr-3 py-2.5 md:py-3 rounded-xl border-2 text-sm outline-none transition-all ".concat(errors.deadline ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-purple-400 bg-white hover:border-gray-300') })] }), errors.deadline && (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-[11px] md:text-xs text-red-500 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { size: 10 }), errors.deadline] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2", children: "Urgensi" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-3 gap-2 md:gap-3", children: urgencyOptions.map(function (_a) {
                                                                            var value = _a.value, label = _a.label, desc = _a.desc;
                                                                            return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { type: "button", whileTap: { scale: 0.95 }, onClick: function () { return setField('urgensi', value); }, className: "p-2.5 md:p-3.5 rounded-xl border-2 text-left transition-all ".concat(form.urgensi === value ? (value === 'Normal' ? 'border-green-400 bg-green-50' : value === 'Urgent' ? 'border-orange-400 bg-orange-50' : 'border-red-400 bg-red-50') : 'border-gray-200 bg-white'), children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-block text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full mb-0.5 md:mb-1 ".concat(form.urgensi === value ? (value === 'Normal' ? 'bg-green-100 text-green-700' : value === 'Urgent' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700') : 'bg-gray-100 text-gray-500'), children: label }), (0, jsx_runtime_1.jsx)("p", { className: "text-[9px] md:text-[11px] text-gray-500", children: desc })] }, value));
                                                                        }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5", children: "Harga (opsional)" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500", children: "Rp" }), (0, jsx_runtime_1.jsx)("input", { type: "number", inputMode: "numeric", placeholder: "Kosongkan jika belum disepakati", value: form.harga, onChange: function (e) { return setField('harga', e.target.value); }, className: "w-full pl-8 pr-3 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 text-sm outline-none transition-all" })] }), estPrice && !form.harga && (0, jsx_runtime_1.jsxs)("p", { className: "mt-1 text-[10px] md:text-xs text-purple-600", children: ["Estimasi: Rp ", estPrice.toLocaleString('id-ID')] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-1.5", children: ["Catatan ", (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400 font-normal", children: "(opsional)" })] }), (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Kebutuhan khusus, referensi...", value: form.catatan, onChange: function (e) { return setField('catatan', e.target.value); }, rows: 2, className: "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 text-sm outline-none resize-none transition-all" })] })] }, "step2")), step === 3 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.25 }, className: "space-y-4 md:space-y-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-base md:text-lg font-bold text-gray-900 mb-0.5", children: "Konfirmasi" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs md:text-sm text-gray-500", children: "Periksa kembali sebelum kirim" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 md:p-5 border border-purple-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3 md:mb-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "Booking ID" }), (0, jsx_runtime_1.jsx)("p", { className: "font-extrabold text-purple-700 tracking-wide text-sm md:text-base", children: bookingId })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 md:space-y-3 text-xs md:text-sm", children: [{ label: 'Nama', val: form.nama }, { label: 'WhatsApp', val: form.whatsapp }, { label: 'Tugas', val: form.jenistugas }, { label: 'Urgensi', val: form.urgensi }, { label: 'Deadline', val: form.deadline ? new Date(form.deadline).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-' }, { label: 'Est. Harga', val: estPrice ? "Rp ".concat(estPrice.toLocaleString('id-ID')) : 'Disepakati' }].map(function (_a) {
                                                                            var label = _a.label, val = _a.val;
                                                                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start gap-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-500 shrink-0", children: label }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-gray-800 text-right", children: val })] }, label));
                                                                        }) }), form.detail && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 md:mt-4 pt-3 md:pt-4 border-t border-purple-200", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[10px] md:text-xs text-gray-500 mb-1", children: "Detail" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs md:text-sm text-gray-700 leading-relaxed", children: form.detail })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-3 md:p-4 bg-green-50 border border-green-200 rounded-2xl text-xs md:text-sm text-green-800 flex gap-2 md:gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 16, className: "shrink-0 mt-0.5 text-green-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold", children: "Setelah kirim..." }), (0, jsx_runtime_1.jsx)("p", { className: "text-green-700 text-[10px] md:text-xs mt-0.5", children: "Anda akan diarahkan ke WhatsApp untuk konfirmasi. Respons < 5 menit!" })] })] })] }, "step3"))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 md:gap-3 mt-6 md:mt-8 sticky bottom-4 md:static", children: [step > 1 && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileTap: { scale: 0.97 }, onClick: goPrev, className: "flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-xs md:text-sm hover:border-gray-300 hover:bg-gray-50 transition-all", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { size: 14 }), "Kembali"] })), step < 3 ? ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileTap: { scale: 0.97 }, onClick: goNext, className: "flex-1 flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 md:py-3 rounded-xl text-xs md:text-sm transition-all shadow-md shadow-purple-300/30", children: ["Lanjut", (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { size: 14 })] })) : ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileTap: { scale: 0.97 }, onClick: handleSubmit, className: "flex-1 flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 md:py-3 rounded-xl text-xs md:text-sm transition-all shadow-md shadow-green-300/30", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { size: 14 }), "Kirim Booking"] }))] })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3, duration: 0.5 }, className: "hidden md:block space-y-4 sticky top-24", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl border border-purple-100 shadow-md p-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calculator, { size: 16, className: "text-purple-600" }), (0, jsx_runtime_1.jsx)("p", { className: "font-bold text-gray-800 text-sm", children: "Estimasi Harga" })] }), form.jenistugas ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-3 bg-purple-50 rounded-2xl border border-purple-100", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400 mb-1", children: [form.jenistugas, " \u00B7 ", form.urgensi] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-extrabold text-purple-700", children: ["Rp ", (estPrice !== null && estPrice !== void 0 ? estPrice : 0).toLocaleString('id-ID')] })] })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400 text-center py-4", children: "Pilih jenis tugas" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-5 text-white text-sm shadow-md", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-bold mb-3", children: "Jaminan Kami" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-2", children: ['Respons &lt; 5 menit', '100% Original', 'Revisi gratis', 'On-time atau uang kembali'].map(function (g) { return ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-center gap-2 text-xs text-purple-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 12, className: "text-green-300 shrink-0" }), g] }, g)); }) })] })] })] })] })] }));
}
