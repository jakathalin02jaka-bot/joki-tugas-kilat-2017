"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentInfo;
exports.PaymentPageInline = PaymentPageInline;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var paymentMethods = [
    {
        id: 'dana',
        name: 'DANA',
        icon: lucide_react_1.Wallet,
        iconBg: 'from-blue-500 to-cyan-500',
        number: '081295991378',
        holder: 'Lindawati Zaini',
        color: 'text-blue-600',
        borderColor: 'border-blue-200',
        bgColor: 'bg-blue-50',
    },
    {
        id: 'bri',
        name: 'BRI',
        icon: lucide_react_1.Building2,
        iconBg: 'from-blue-700 to-indigo-700',
        number: '0442-01-065088-50-4',
        holder: 'Jaka Anzor Thaliin',
        color: 'text-blue-700',
        borderColor: 'border-blue-200',
        bgColor: 'bg-blue-50/50',
    },
];
function CopyButton(_a) {
    var _this = this;
    var text = _a.text, label = _a.label;
    var _b = (0, react_1.useState)(false), copied = _b[0], setCopied = _b[1];
    var handleCopy = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, ta;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.writeText(text)];
                case 1:
                    _b.sent();
                    setCopied(true);
                    sonner_1.toast.success("".concat(label, " disalin!"), { description: text });
                    setTimeout(function () { return setCopied(false); }, 2000);
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    ta = document.createElement('textarea');
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    setCopied(true);
                    sonner_1.toast.success("".concat(label, " disalin!"), { description: text });
                    setTimeout(function () { return setCopied(false); }, 2000);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.08 }, whileTap: { scale: 0.92 }, onClick: handleCopy, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ".concat(copied
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300'), children: [copied ? (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { size: 13 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { size: 13 }), copied ? 'Tersalin' : 'Salin'] }));
}
function PaymentInfo(_a) {
    var compact = _a.compact;
    return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3 ".concat(compact ? '' : 'max-w-md mx-auto'), children: paymentMethods.map(function (method, i) {
            var Icon = method.icon;
            return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.1, duration: 0.4 }, whileHover: { scale: 1.01 }, className: "relative rounded-2xl border-2 ".concat(method.borderColor, " ").concat(method.bgColor, " p-4 transition-all duration-200 hover:shadow-md"), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-11 h-11 rounded-xl bg-gradient-to-br ".concat(method.iconBg, " flex items-center justify-center shadow-md shrink-0"), children: (0, jsx_runtime_1.jsx)(Icon, { size: 20, className: "text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-0.5", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-bold text-sm ".concat(method.color), children: method.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-[10px] text-gray-400 bg-white/80 px-1.5 py-0.5 rounded-full border border-gray-200", children: "Transfer" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-wrap", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-mono text-sm font-bold text-gray-800 tracking-wide", children: method.number }), (0, jsx_runtime_1.jsx)(CopyButton, { text: method.number, label: "Nomor ".concat(method.name) })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-0.5", children: ["a.n. ", method.holder] })] })] }) }, method.id));
        }) }));
}
function PaymentPageInline() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl border-2 border-purple-200 p-6 md:p-8 shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-6", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', stiffness: 200 }, className: "w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Wallet, { size: 26, className: "text-white" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Pembayaran" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Transfer ke salah satu rekening di bawah ini" })] }), (0, jsx_runtime_1.jsx)(PaymentInfo, {}), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1.5", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold", children: "Catatan Penting:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 list-disc list-inside", children: [(0, jsx_runtime_1.jsx)("li", { children: "Setelah transfer, kirimkan bukti pembayaran ke WhatsApp admin" }), (0, jsx_runtime_1.jsx)("li", { children: "Admin akan memverifikasi pembayaran dalam 5-10 menit" }), (0, jsx_runtime_1.jsx)("li", { children: "Pastikan nominal transfer sesuai dengan harga yang disepakati" }), (0, jsx_runtime_1.jsx)("li", { children: "Simpan bukti transfer untuk jaga-jaga" })] })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.a, { whileHover: { scale: 1.03 }, whileTap: { scale: 0.97 }, href: "https://wa.me/6281295991378?text=Halo%2C%20saya%20sudah%20transfer%20dan%20mau%20kirim%20bukti%20pembayaran", target: "_blank", rel: "noopener noreferrer", className: "mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-green-200", children: "Kirim Bukti Pembayaran via WhatsApp" })] }));
}
