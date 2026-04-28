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
exports.Command = Command;
exports.CommandDialog = CommandDialog;
exports.CommandInput = CommandInput;
exports.CommandList = CommandList;
exports.CommandEmpty = CommandEmpty;
exports.CommandGroup = CommandGroup;
exports.CommandItem = CommandItem;
exports.CommandShortcut = CommandShortcut;
exports.CommandSeparator = CommandSeparator;
var jsx_runtime_1 = require("react/jsx-runtime");
var cmdk_1 = require("cmdk");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var dialog_1 = require("@/components/ui/dialog");
function Command(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(cmdk_1.Command, __assign({ "data-slot": "command", className: (0, utils_1.cn)("bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md", className) }, props)));
}
function CommandDialog(_a) {
    var _b = _a.title, title = _b === void 0 ? "Command Palette" : _b, _c = _a.description, description = _c === void 0 ? "Search for a command to run..." : _c, children = _a.children, className = _a.className, _d = _a.showCloseButton, showCloseButton = _d === void 0 ? true : _d, props = __rest(_a, ["title", "description", "children", "className", "showCloseButton"]);
    return ((0, jsx_runtime_1.jsxs)(dialog_1.Dialog, __assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(dialog_1.DialogHeader, { className: "sr-only", children: [(0, jsx_runtime_1.jsx)(dialog_1.DialogTitle, { children: title }), (0, jsx_runtime_1.jsx)(dialog_1.DialogDescription, { children: description })] }), (0, jsx_runtime_1.jsx)(dialog_1.DialogContent, { className: (0, utils_1.cn)("overflow-hidden p-0", className), showCloseButton: showCloseButton, children: (0, jsx_runtime_1.jsx)(Command, { className: "[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children: children }) })] })));
}
function CommandInput(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsxs)("div", { "data-slot": "command-input-wrapper", className: "flex h-9 items-center gap-2 border-b px-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SearchIcon, { className: "size-4 shrink-0 opacity-50" }), (0, jsx_runtime_1.jsx)(cmdk_1.Command.Input, __assign({ "data-slot": "command-input", className: (0, utils_1.cn)("placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className) }, props))] }));
}
function CommandList(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(cmdk_1.Command.List, __assign({ "data-slot": "command-list", className: (0, utils_1.cn)("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className) }, props)));
}
function CommandEmpty(_a) {
    var props = __rest(_a, []);
    return ((0, jsx_runtime_1.jsx)(cmdk_1.Command.Empty, __assign({ "data-slot": "command-empty", className: "py-6 text-center text-sm" }, props)));
}
function CommandGroup(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(cmdk_1.Command.Group, __assign({ "data-slot": "command-group", className: (0, utils_1.cn)("text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium", className) }, props)));
}
function CommandSeparator(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(cmdk_1.Command.Separator, __assign({ "data-slot": "command-separator", className: (0, utils_1.cn)("bg-border -mx-1 h-px", className) }, props)));
}
function CommandItem(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(cmdk_1.Command.Item, __assign({ "data-slot": "command-item", className: (0, utils_1.cn)("data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className) }, props)));
}
function CommandShortcut(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("span", __assign({ "data-slot": "command-shortcut", className: (0, utils_1.cn)("text-muted-foreground ml-auto text-xs tracking-widest", className) }, props)));
}
