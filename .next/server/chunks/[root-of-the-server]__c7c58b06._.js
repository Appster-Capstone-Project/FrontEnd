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
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[project]/src/app/api/events/stream/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/api/events/stream/route.ts
__turbopack_context__.s({
    "GET": (()=>GET),
    "dynamic": (()=>dynamic)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/stream [external] (stream, cjs)");
;
// This is the backend endpoint we will be proxying to.
const BACKEND_SSE_URL = `${("TURBOPACK compile-time value", "http://20.168.243.183:8000")}/events/stream`;
const dynamic = 'force-dynamic'; // Ensures this route is not statically built
async function GET(req) {
    const authToken = req.headers.get('Authorization');
    if (!authToken) {
        console.error('[SSE PROXY] Authorization header is required');
        return new Response('Authorization header is required', {
            status: 401
        });
    }
    // Create a transform stream that will be piped to the client.
    const stream = new __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["PassThrough"]();
    try {
        console.log(`[SSE PROXY] Attempting to connect to backend: ${BACKEND_SSE_URL}`);
        const response = await fetch(BACKEND_SSE_URL, {
            method: 'GET',
            headers: {
                Authorization: authToken,
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache'
            },
            // IMPORTANT: This request should not be buffered.
            // @ts-ignore
            duplex: 'half'
        });
        if (!response.ok || !response.body) {
            const text = await response.text();
            console.error(`[SSE PROXY] Backend connection failed: ${response.status} ${response.statusText}`, text);
            return new Response(`Failed to connect to the backend event stream: ${text}`, {
                status: response.status
            });
        }
        console.log('[SSE PROXY] Successfully connected to backend stream.');
        const reader = response.body.getReader();
        const push = async ()=>{
            while(true){
                const { done, value } = await reader.read();
                if (done) {
                    console.log('[SSE PROXY] Backend stream ended.');
                    stream.end();
                    break;
                }
                stream.write(value);
            }
        };
        push().catch((e)=>{
            console.error('[SSE PROXY] Error while reading from backend:', e);
            stream.end();
        });
        // Return the stream to the client.
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive'
            }
        });
    } catch (error) {
        console.error('[SSE PROXY] Fetching backend stream failed:', error);
        return new Response('Internal Server Error while connecting to stream', {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__c7c58b06._.js.map