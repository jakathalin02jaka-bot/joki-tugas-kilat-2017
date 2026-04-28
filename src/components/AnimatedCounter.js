"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AnimatedCounter;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
function AnimatedCounter(_a) {
    var end = _a.end, _b = _a.suffix, suffix = _b === void 0 ? '' : _b, _c = _a.prefix, prefix = _c === void 0 ? '' : _c, _d = _a.duration, duration = _d === void 0 ? 2 : _d, _e = _a.className, className = _e === void 0 ? '' : _e;
    var _f = (0, react_1.useState)(0), count = _f[0], setCount = _f[1];
    var ref = (0, react_1.useRef)(null);
    var isInView = (0, framer_motion_1.useInView)(ref, { once: true, margin: '-50px' });
    var hasAnimated = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (!isInView || hasAnimated.current)
            return;
        hasAnimated.current = true;
        var startTime = performance.now();
        var animate = function (now) {
            var elapsed = now - startTime;
            var progress = Math.min(elapsed / (duration * 1000), 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1)
                requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, end, duration]);
    return ((0, jsx_runtime_1.jsxs)("span", { ref: ref, className: className, children: [prefix, count.toLocaleString('id-ID'), suffix] }));
}
