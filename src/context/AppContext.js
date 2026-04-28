"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApp = void 0;
exports.AppProvider = AppProvider;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var AppContext = (0, react_1.createContext)({
    darkMode: false,
    toggleDarkMode: function () { },
    adminLoggedIn: false,
    adminLogin: function () { },
    adminLogout: function () { },
    pendingCount: 0,
});
function AppProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(function () {
        if (typeof window === 'undefined')
            return false;
        return localStorage.getItem('jtk_darkmode') === 'true' ||
            (!localStorage.getItem('jtk_darkmode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }), darkMode = _b[0], setDarkMode = _b[1];
    var _c = (0, react_1.useState)(function () {
        if (typeof window === 'undefined')
            return false;
        return localStorage.getItem('jtk_admin_auth') === 'true';
    }), adminLoggedIn = _c[0], setAdminLoggedIn = _c[1];
    var _d = (0, react_1.useState)(0), pendingCount = _d[0], setPendingCount = _d[1];
    (0, react_1.useEffect)(function () {
        localStorage.setItem('jtk_darkmode', String(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);
    (0, react_1.useEffect)(function () {
        var checkPending = function () {
            try {
                var raw = localStorage.getItem('jtk_bookings');
                if (!raw) {
                    setPendingCount(0);
                    return;
                }
                var bookings = JSON.parse(raw);
                var count = bookings.filter(function (b) { return b.status === 'Pending'; }).length;
                setPendingCount(count);
            }
            catch (_a) {
                setPendingCount(0);
            }
        };
        checkPending();
        var id = setInterval(checkPending, 10000);
        return function () { return clearInterval(id); };
    }, []);
    var toggleDarkMode = function () { return setDarkMode(function (p) { return !p; }); };
    var adminLogin = function () {
        setAdminLoggedIn(true);
        localStorage.setItem('jtk_admin_auth', 'true');
    };
    var adminLogout = function () {
        setAdminLoggedIn(false);
        localStorage.removeItem('jtk_admin_auth');
    };
    return ((0, jsx_runtime_1.jsx)(AppContext.Provider, { value: { darkMode: darkMode, toggleDarkMode: toggleDarkMode, adminLoggedIn: adminLoggedIn, adminLogin: adminLogin, adminLogout: adminLogout, pendingCount: pendingCount }, children: children }));
}
var useApp = function () { return (0, react_1.useContext)(AppContext); };
exports.useApp = useApp;
