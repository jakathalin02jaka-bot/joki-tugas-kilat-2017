"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_router_dom_1 = require("react-router-dom");
var sonner_1 = require("sonner");
var AppContext_1 = require("./context/AppContext");
require("./index.css");
var App_1 = require("./App");
(0, client_1.createRoot)(document.getElementById('root')).render((0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(AppContext_1.AppProvider, { children: [(0, jsx_runtime_1.jsx)(sonner_1.Toaster, { position: "top-center", toastOptions: {
                        style: {
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            borderRadius: '16px',
                        },
                    } }), (0, jsx_runtime_1.jsx)(App_1.default, {})] }) }) }));
