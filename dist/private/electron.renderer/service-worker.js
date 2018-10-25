/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("/workbox-v3.6.2/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/workbox-v3.6.2"});

importScripts(
  "/precache-manifest.2e6f5bc60b00a7a3e266d4098399b9c3.js"
);

workbox.core.setCacheNameDetails({prefix: "DDMusic"});

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.+(?:png|gif|jpg|jpeg|svg)$/, workbox.strategies.cacheFirst({ "cacheName":"DDMusic-images", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"maxAgeSeconds":2592000,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/\.(?:js|css)$/, workbox.strategies.staleWhileRevalidate({ "cacheName":"DDMusic-static-resources", plugins: [] }), 'GET');
