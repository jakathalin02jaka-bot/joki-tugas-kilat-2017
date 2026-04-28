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
exports.Item = Item;
exports.ItemMedia = ItemMedia;
exports.ItemContent = ItemContent;
exports.ItemActions = ItemActions;
exports.ItemGroup = ItemGroup;
exports.ItemSeparator = ItemSeparator;
exports.ItemTitle = ItemTitle;
exports.ItemDescription = ItemDescription;
exports.ItemHeader = ItemHeader;
exports.ItemFooter = ItemFooter;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_slot_1 = require("@radix-ui/react-slot");
var class_variance_authority_1 = require("class-variance-authority");
var utils_1 = require("@/lib/utils");
var separator_1 = require("@/components/ui/separator");
function ItemGroup(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ role: "list", "data-slot": "item-group", className: (0, utils_1.cn)("group/item-group flex flex-col", className) }, props)));
}
function ItemSeparator(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)(separator_1.Separator, __assign({ "data-slot": "item-separator", orientation: "horizontal", className: (0, utils_1.cn)("my-0", className) }, props)));
}
var itemVariants = (0, class_variance_authority_1.cva)("group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", {
    variants: {
        variant: {
            default: "bg-transparent",
            outline: "border-border",
            muted: "bg-muted/50",
        },
        size: {
            default: "p-4 gap-4 ",
            sm: "py-3 px-4 gap-2.5",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Item(_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "default" : _b, _c = _a.size, size = _c === void 0 ? "default" : _c, _d = _a.asChild, asChild = _d === void 0 ? false : _d, props = __rest(_a, ["className", "variant", "size", "asChild"]);
    var Comp = asChild ? react_slot_1.Slot : "div";
    return ((0, jsx_runtime_1.jsx)(Comp, __assign({ "data-slot": "item", "data-variant": variant, "data-size": size, className: (0, utils_1.cn)(itemVariants({ variant: variant, size: size, className: className })) }, props)));
}
var itemMediaVariants = (0, class_variance_authority_1.cva)("flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5", {
    variants: {
        variant: {
            default: "bg-transparent",
            icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
            image: "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function ItemMedia(_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "default" : _b, props = __rest(_a, ["className", "variant"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "item-media", "data-variant": variant, className: (0, utils_1.cn)(itemMediaVariants({ variant: variant, className: className })) }, props)));
}
function ItemContent(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "item-content", className: (0, utils_1.cn)("flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none", className) }, props)));
}
function ItemTitle(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "item-title", className: (0, utils_1.cn)("flex w-fit items-center gap-2 text-sm leading-snug font-medium", className) }, props)));
}
function ItemDescription(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("p", __assign({ "data-slot": "item-description", className: (0, utils_1.cn)("text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance", "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4", className) }, props)));
}
function ItemActions(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "item-actions", className: (0, utils_1.cn)("flex items-center gap-2", className) }, props)));
}
function ItemHeader(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "item-header", className: (0, utils_1.cn)("flex basis-full items-center justify-between gap-2", className) }, props)));
}
function ItemFooter(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ "data-slot": "item-footer", className: (0, utils_1.cn)("flex basis-full items-center justify-between gap-2", className) }, props)));
}
