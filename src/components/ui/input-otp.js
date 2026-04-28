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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputOTP = InputOTP;
exports.InputOTPGroup = InputOTPGroup;
exports.InputOTPSlot = InputOTPSlot;
exports.InputOTPSeparator = InputOTPSeparator;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var input_otp_1 = require("input-otp");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
function InputOTP(_a) {
    var className = _a.className, containerClassName = _a.containerClassName, props = __rest(_a, ["className", "containerClassName"]);
    return ((0, jsx_runtime_1.jsx)(input_otp_1.OTPInput, __assign({ "data-slot": "input-otp", containerClassName: (0, utils_1.cn)("flex items-center gap-2 has-disabled:opacity-50", containerClassName), className: (0, utils_1.cn)("disabled:cursor-not-allowed", className) }, props)));
}
function InputOTPGroup(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "input-otp-group", className: (0, utils_1.cn)("flex items-center", className) }, props)));
}
function InputOTPSlot(_a) {
    var _b;
    var index = _a.index, className = _a.className, props = __rest(_a, ["index", "className"]);
    var inputOTPContext = React.useContext(input_otp_1.OTPInputContext);
    var _c = (_b = inputOTPContext === null || inputOTPContext === void 0 ? void 0 : inputOTPContext.slots[index]) !== null && _b !== void 0 ? _b : {}, char = _c.char, hasFakeCaret = _c.hasFakeCaret, isActive = _c.isActive;
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ "data-slot": "input-otp-slot", "data-active": isActive, className: (0, utils_1.cn)("data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]", className) }, props, { children: [char, hasFakeCaret && ((0, jsx_runtime_1.jsx)("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-caret-blink bg-foreground h-4 w-px duration-1000" }) }))] })));
}
function InputOTPSeparator(_a) {
    var props = __rest(_a, []);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "input-otp-separator", role: "separator" }, props, { children: (0, jsx_runtime_1.jsx)(lucide_react_1.MinusIcon, {}) })));
}
