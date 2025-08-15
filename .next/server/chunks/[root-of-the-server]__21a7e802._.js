module.exports = {

"[project]/.next-internal/server/app/api/events/stream/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/events/stream/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "dynamic": (()=>dynamic)
});
const dynamic = 'force-dynamic'; // Ensures this route is not statically built
const GET = async (req)=>{
    const token = req.headers.get("authorization"); // get frontend token
    if (!token) {
        console.error('[SSE PROXY] Authorization header missing from client request.');
        return new Response("Unauthorized: Authorization header is required", {
            status: 401
        });
    }
    // Open a server-to-server connection to your backend SSE
    const backendUrl = `${("TURBOPACK compile-time value", "http://20.168.243.183:8000")}/events/stream`;
    console.log(`[SSE PROXY] Attempting to connect to backend: ${backendUrl}`);
    try {
        const backendRes = await fetch(backendUrl, {
            headers: {
                Authorization: token
            },
            // @ts-ignore
            duplex: 'half'
        });
        if (!backendRes.ok || !backendRes.body) {
            const errorBody = await backendRes.text();
            console.error(`[SSE PROXY] Backend connection failed with status ${backendRes.status}: ${errorBody}`);
            return new Response(`Backend SSE connection failed: ${errorBody}`, {
                status: backendRes.status
            });
        }
        console.log('[SSE PROXY] Successfully connected to backend stream. Piping to client.');
        // Pipe the backend SSE stream directly to the frontend
        return new Response(backendRes.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive"
            }
        });
    } catch (error) {
        console.error('[SSE PROXY] An unexpected error occurred:', error);
        return new Response('Internal Server Error while connecting to stream', {
            status: 500
        });
    }
};
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__21a7e802._.js.map