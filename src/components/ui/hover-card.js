"use client";
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
exports.HoverCard = HoverCard;
exports.HoverCardTrigger = HoverCardTrigger;
exports.HoverCardContent = HoverCardContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var HoverCardPrimitive = require("@radix-ui/react-hover-card");
var utils_1 = require("@/lib/utils");
function HoverCard(_a) {
    var props = __rest(_a, []);
    return (0, jsx_runtime_1.jsx)(HoverCardPrimitive.Root, __assign({ "data-slot": "hover-card" }, props));
}
function HoverCardTrigger(_a) {
    var props = __rest(_a, []);
    return ((0, jsx_runtime_1.jsx)(HoverCardPrimitive.Trigger, __assign({ "data-slot": "hover-card-trigger" }, props)));
}
function HoverCardContent(_a) {
    var className = _a.className, _b = _a.align, align = _b === void 0 ? "center" : _b, _c = _a.sideOffset, sideOffset = _c === void 0 ? 4 : _c, props = __rest(_a, ["className", "align", "sideOffset"]);
    return ((0, jsx_runtime_1.jsx)(HoverCardPrimitive.Portal, { "data-slot": "hover-card-portal", children: (0, jsx_runtime_1.jsx)(HoverCardPrimitive.Content, __assign({ "data-slot": "hover-card-content", align: align, sideOffset: sideOffset, className: (0, utils_1.cn)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className) }, props)) }));
}
