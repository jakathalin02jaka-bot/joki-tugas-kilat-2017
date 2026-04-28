"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThreeBackground;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var fiber_1 = require("@react-three/fiber");
var THREE = require("three");
function Particles(_a) {
    var _b = _a.count, count = _b === void 0 ? 60 : _b;
    var mesh = (0, react_1.useRef)(null);
    var dummy = (0, react_1.useMemo)(function () { return new THREE.Object3D(); }, []);
    var particles = (0, react_1.useMemo)(function () {
        return Array.from({ length: count }, function () { return ({
            position: new THREE.Vector3((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6),
            speed: 0.002 + Math.random() * 0.004,
            offset: Math.random() * Math.PI * 2,
            scale: 0.02 + Math.random() * 0.04,
        }); });
    }, [count]);
    (0, fiber_1.useFrame)(function (_a) {
        var clock = _a.clock;
        if (!mesh.current)
            return;
        var t = clock.getElapsedTime();
        particles.forEach(function (p, i) {
            dummy.position.set(p.position.x + Math.sin(t * p.speed + p.offset) * 0.5, p.position.y + Math.cos(t * p.speed * 0.7 + p.offset) * 0.3, p.position.z + Math.sin(t * p.speed * 0.5 + p.offset) * 0.2);
            dummy.rotation.set(t * p.speed + i, t * p.speed * 0.5 + i, 0);
            dummy.scale.setScalar(p.scale);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });
    return ((0, jsx_runtime_1.jsxs)("instancedMesh", { ref: mesh, args: [undefined, undefined, count], children: [(0, jsx_runtime_1.jsx)("octahedronGeometry", { args: [1, 0] }), (0, jsx_runtime_1.jsx)("meshStandardMaterial", { color: "#c084fc", emissive: "#7c3aed", emissiveIntensity: 0.6, transparent: true, opacity: 0.7 })] }));
}
function FloatingOrbs() {
    var group = (0, react_1.useRef)(null);
    (0, fiber_1.useFrame)(function (_a) {
        var clock = _a.clock;
        if (!group.current)
            return;
        var t = clock.getElapsedTime();
        group.current.children.forEach(function (child, i) {
            child.position.y += Math.sin(t * 0.3 + i * 1.5) * 0.002;
            child.position.x += Math.cos(t * 0.2 + i) * 0.001;
        });
    });
    return ((0, jsx_runtime_1.jsxs)("group", { ref: group, children: [(0, jsx_runtime_1.jsxs)("mesh", { position: [-3, 1, -2], children: [(0, jsx_runtime_1.jsx)("sphereGeometry", { args: [0.4, 32, 32] }), (0, jsx_runtime_1.jsx)("meshStandardMaterial", { color: "#818cf8", emissive: "#4f46e5", emissiveIntensity: 0.4, transparent: true, opacity: 0.35 })] }), (0, jsx_runtime_1.jsxs)("mesh", { position: [3, -0.5, -1], children: [(0, jsx_runtime_1.jsx)("sphereGeometry", { args: [0.6, 32, 32] }), (0, jsx_runtime_1.jsx)("meshStandardMaterial", { color: "#a78bfa", emissive: "#7c3aed", emissiveIntensity: 0.3, transparent: true, opacity: 0.25 })] }), (0, jsx_runtime_1.jsxs)("mesh", { position: [1.5, 2, -3], children: [(0, jsx_runtime_1.jsx)("sphereGeometry", { args: [0.3, 32, 32] }), (0, jsx_runtime_1.jsx)("meshStandardMaterial", { color: "#c084fc", emissive: "#9333ea", emissiveIntensity: 0.5, transparent: true, opacity: 0.4 })] })] }));
}
function ThreeBackground() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 z-0 pointer-events-none", children: (0, jsx_runtime_1.jsxs)(fiber_1.Canvas, { camera: { position: [0, 0, 5], fov: 60 }, dpr: [1, 1.5], gl: { antialias: true, alpha: true }, style: { background: 'transparent' }, children: [(0, jsx_runtime_1.jsx)("ambientLight", { intensity: 0.5 }), (0, jsx_runtime_1.jsx)("pointLight", { position: [5, 5, 5], intensity: 0.8, color: "#c084fc" }), (0, jsx_runtime_1.jsx)("pointLight", { position: [-5, -3, 3], intensity: 0.5, color: "#818cf8" }), (0, jsx_runtime_1.jsx)(Particles, { count: 50 }), (0, jsx_runtime_1.jsx)(FloatingOrbs, {})] }) }));
}
