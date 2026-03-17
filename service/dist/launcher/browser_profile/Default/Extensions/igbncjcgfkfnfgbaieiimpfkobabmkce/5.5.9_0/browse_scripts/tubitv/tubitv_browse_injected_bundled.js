/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/Teleparty/Enums/InternalStreamingServiceName.ts
var InternalStreamingServiceName;
(function (InternalStreamingServiceName) {
    InternalStreamingServiceName["NETFLIX"] = "netflix";
    InternalStreamingServiceName["HULU"] = "hulu";
    InternalStreamingServiceName["DISNEY_PLUS"] = "disney";
    InternalStreamingServiceName["STAR_PLUS"] = "starplus";
    InternalStreamingServiceName["AMAZON"] = "amazon";
    InternalStreamingServiceName["YOUTUBE"] = "youtube";
    InternalStreamingServiceName["HBO_MAX"] = "hbomax";
    InternalStreamingServiceName["MAX"] = "max";
    InternalStreamingServiceName["FUBO"] = "fubo";
    InternalStreamingServiceName["CRUNCHYROLL"] = "crunchyroll";
    InternalStreamingServiceName["PARAMOUNT"] = "paramount";
    InternalStreamingServiceName["PEACOCK"] = "peacock";
    InternalStreamingServiceName["HOTSTAR"] = "hotstar";
    InternalStreamingServiceName["DISNEY_PLUS_MENA"] = "disneymena";
    InternalStreamingServiceName["APPLE_TV"] = "appletv";
    InternalStreamingServiceName["PLUTO_TV"] = "plutotv";
    InternalStreamingServiceName["FUNIMATION"] = "funimation";
    InternalStreamingServiceName["TUBI_TV"] = "tubitv";
    InternalStreamingServiceName["JIO_CINEMA"] = "jiocinema";
    InternalStreamingServiceName["MUBI"] = "mubi";
    InternalStreamingServiceName["CRAVE"] = "crave";
    InternalStreamingServiceName["STAN"] = "stan";
    InternalStreamingServiceName["SONY_LIV"] = "sonyliv";
    InternalStreamingServiceName["ZEE5"] = "zee5";
    InternalStreamingServiceName["HULU_JP"] = "hulujp";
    InternalStreamingServiceName["UNEXT"] = "unext";
    InternalStreamingServiceName["GLOBOPLAY"] = "globoplay";
    InternalStreamingServiceName["WILLOW"] = "willow";
    InternalStreamingServiceName["FANCODE"] = "fancode";
    InternalStreamingServiceName["CANALPLUS"] = "canalplus";
    InternalStreamingServiceName["SHAHID"] = "shahid";
    InternalStreamingServiceName["RTL"] = "rtl";
    InternalStreamingServiceName["ESPN"] = "espn";
    InternalStreamingServiceName["SLING"] = "sling";
    InternalStreamingServiceName["VIKI"] = "viki";
    InternalStreamingServiceName["SPOTIFY"] = "spotify";
    InternalStreamingServiceName["SHOWTIME"] = "showtime";
    InternalStreamingServiceName["SHUDDER"] = "shudder";
    InternalStreamingServiceName["AMC_PLUS"] = "amcplus";
    InternalStreamingServiceName["VIU"] = "viu";
    InternalStreamingServiceName["VIDIO"] = "vidio";
})(InternalStreamingServiceName || (InternalStreamingServiceName = {}));

;// ./src/Teleparty/Constants/env.ts
var _a, _b, _c, _d, _e, _f;
// NOTE: Changing the .env file seems to require re-running build-dev-watch
// if you are using that for development.
const PROD_DEFAULTS = {
    API_URL: "https://api.teleparty.com",
    WEBSOCKETS_URL: "wss://ws.teleparty.com",
    REDIRECT_URL: "https://www.teleparty.com",
    // This is a public key, so it's okay to hardcode it here
    POSTHOG_API_KEY: "phc_8h1T6DYsM416utBY2HpUYkyyBKyVErAyoNpFbtp2D9b",
    POSTHOG_API_HOST: "https://us.i.posthog.com",
    IMAGE_CDN_URL: "https://files.teleparty.com",
};
const API_URL =  true ? PROD_DEFAULTS.API_URL : 0;
const WEBSOCKETS_URL =  true
    ? PROD_DEFAULTS.WEBSOCKETS_URL
    : 0;
const REDIRECT_URL =  true
    ? PROD_DEFAULTS.REDIRECT_URL
    : 0;
const PROD_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDvZJAoFJkT2lBrhloA0e9XwKmLgELTAeQ",
    authDomain: "teleparty-mobile.firebaseapp.com",
    projectId: "teleparty-mobile",
    storageBucket: "teleparty-mobile.appspot.com",
    messagingSenderId: "961974665980",
    appId: "1:961974665980:web:fe4179db8591331aeb8d79",
    measurementId: "G-PC36DK40FL",
};
const DEV_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDmxz7HsfNuhW52Mti-Q9lAGHJYOzEijb8",
    authDomain: "teleparty-auth---test.firebaseapp.com",
    projectId: "teleparty-auth---test",
    storageBucket: "teleparty-auth---test.appspot.com",
    messagingSenderId: "391169153212",
    appId: "1:391169153212:web:0eae4ff68890df614b18b9",
    measurementId: "G-MFZH5P1Z4E",
};
const FIREBASE_CONFIG =  true ? PROD_FIREBASE_CONFIG : 0;
// PostHog Configuration
const POSTHOG_API_KEY =  true
    ? PROD_DEFAULTS.POSTHOG_API_KEY
    : 0;
const POSTHOG_API_HOST =  true
    ? PROD_DEFAULTS.POSTHOG_API_HOST
    : 0;
const IGNORE_UNDER_MAINTENANCE =  true ? false : 0;
const IMAGE_CDN_URL =  true
    ? PROD_DEFAULTS.IMAGE_CDN_URL
    : 0;
const BACKEND_SELECTOR_AWS_CDN = "MISSING_ENV_VAR".BACKEND_SELECTOR_AWS_CDN || "https://d1491j4uhxdasz.cloudfront.net";

;// ./src/Teleparty/Managers/ServiceAvailability.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const CACHE_KEY = "tp_services_cache";
const CACHE_TS_KEY = "tp_services_cache_ts";
function storageGet(keys) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const api = ((_b = (_a = globalThis.chrome) === null || _a === void 0 ? void 0 : _a.storage) === null || _b === void 0 ? void 0 : _b.local) || ((_d = (_c = globalThis.browser) === null || _c === void 0 ? void 0 : _c.storage) === null || _d === void 0 ? void 0 : _d.local);
        if (api) {
            return yield new Promise((resolve) => {
                api.get(keys, (items) => {
                    var _a;
                    const out = {};
                    for (const k of keys)
                        out[k] = (_a = items === null || items === void 0 ? void 0 : items[k]) !== null && _a !== void 0 ? _a : null;
                    resolve(out);
                });
            });
        }
        const out = {};
        for (const k of keys)
            out[k] = (_f = (_e = globalThis.localStorage) === null || _e === void 0 ? void 0 : _e.getItem(k)) !== null && _f !== void 0 ? _f : null;
        return out;
    });
}
function storageSet(obj) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const api = ((_b = (_a = globalThis.chrome) === null || _a === void 0 ? void 0 : _a.storage) === null || _b === void 0 ? void 0 : _b.local) || ((_d = (_c = globalThis.browser) === null || _c === void 0 ? void 0 : _c.storage) === null || _d === void 0 ? void 0 : _d.local);
        if (api) {
            yield new Promise((resolve) => api.set(obj, resolve));
            return;
        }
        for (const [k, v] of Object.entries(obj)) {
            try {
                (_e = globalThis.localStorage) === null || _e === void 0 ? void 0 : _e.setItem(k, String(v));
            }
            catch (_f) {
                /* ignore */
            }
        }
    });
}
function setCache(list) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield storageSet({
                [CACHE_KEY]: JSON.stringify(list),
                [CACHE_TS_KEY]: String(Date.now()),
            });
        }
        catch (_a) {
            /* ignore cache write errors */
        }
    });
}
function getServicesCached(ttlMs = 60000) {
    return __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        try {
            const { [CACHE_KEY]: s, [CACHE_TS_KEY]: t } = yield storageGet([CACHE_KEY, CACHE_TS_KEY]);
            if (s && t && now - Number(t) < ttlMs) {
                console.log("cache hit");
                return JSON.parse(s);
            }
        }
        catch (_a) {
            console.warn("Cache read error, resetting to empty list");
            yield setCache([]);
        }
        try {
            console.log("no cache hit");
            const resp = yield fetch(`${API_URL}/services`, {
                method: "GET",
                headers: { Accept: "application/json" },
                cache: "no-store",
            });
            if (!resp.ok)
                throw new Error(String(resp.status));
            const list = (yield resp.json());
            yield setCache(list);
            return list;
        }
        catch (_b) {
            console.error("Fetch failed, caching empty list");
            yield setCache([]);
            return [];
        }
    });
}
/**
 * Returns the names of services whose extensions are currently under maintenance.
 *
 * The result is derived from the cached service list (respecting `ttlMs`). Although all
 * returned names belong to `InternalStreamingServiceName`, this function returns
 * `string[]` for simpler consumption.
 */
function getUnavailableServiceNames(ttlMs = 60000) {
    return __awaiter(this, void 0, void 0, function* () {
        const all = yield getServicesCached(ttlMs);
        return all.filter((s) => s.extensionUnderMaintenance).map((s) => s.name);
    });
}

;// ./src/Teleparty/BrowseScripts/NativePartyHandler.ts
var NativePartyHandler_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function getTelepartyConfig() {
    try {
        const stored = sessionStorage.getItem("telepartyPremiumConfig");
        if (stored) {
            const config = JSON.parse(stored);
            return config;
        }
    }
    catch (e) {
        // console.error("Error parsing sessionStorage config:", e)
    }
    return null;
}
function addNativePartyHandler(tryAddButton, service) {
    return NativePartyHandler_awaiter(this, void 0, void 0, function* () {
        const unavailable = yield getUnavailableServiceNames();
        // Immediately bail out if this service is under maintenance
        if (unavailable.includes(service)) {
            console.log(`Service under maintenance: ${service}`);
            return;
        }
        setInterval(() => {
            try {
                const buttons = tryAddButton();
                if (buttons) {
                    for (const button of buttons) {
                        const existingHandler = button.button._telepartyHandler;
                        if (existingHandler) {
                            button.button.removeEventListener("click", existingHandler);
                        }
                        const clickHandler = (e) => {
                            console.log("Native party button clicked");
                            const config = getTelepartyConfig();
                            if ((config === null || config === void 0 ? void 0 : config.serviceIsPremium) && !(config === null || config === void 0 ? void 0 : config.userHasPremium)) {
                                console.log("Redirecting non-premium user on premium service to premium page");
                                window.open("https://teleparty.com/premium?ref=start-" + config.serviceName, "_blank");
                                return;
                            }
                            localStorage.setItem("nativeParty", JSON.stringify({
                                shouldStart: true,
                                expiry: Date.now() + 1000 * 60 * 2,
                                randomId: Math.random().toString(),
                            }));
                            button.play(e);
                        };
                        button.button._telepartyHandler = clickHandler;
                        button.button.addEventListener("click", clickHandler);
                    }
                }
            }
            catch (error) {
                // console.error("Error in addNativePartyHandler:", error)
            }
        }, 500);
    });
}

;// ./src/Teleparty/BrowseScripts/TubiTV/tubitv_browse_injected.js


function addNativePartyButton() {
    var _a, _b;
    if (document.querySelector("video"))
        return undefined;
    const isSeriesMoreInfoPage = window.location.href.includes("/series/");
    const carouselShowDurationText = (_b = (_a = document
        .querySelector('div[data-test-id="web-featured-carousel-with-dots"]')) === null || _a === void 0 ? void 0 : _a.querySelector('span[class="web-attributes__year-duration"]')) === null || _b === void 0 ? void 0 : _b.textContent;
    const isCarouselOfSeries = carouselShowDurationText === null || carouselShowDurationText === void 0 ? void 0 : carouselShowDurationText.includes("Season");
    // since the play button is same for all carousel banners, need to remove the native button for series
    // since clicking 'watch now' for series takes to the series info page
    if (isCarouselOfSeries && document.getElementById("native-party-button")) {
        document.getElementById("native-party-button").remove();
        return undefined;
    }
    if (document.getElementById("native-party-button") != null || isCarouselOfSeries) {
        return undefined;
    }
    const playButton = document.querySelector('button[data-test-id="web-ui-web-button"]');
    const isButtonCorrect = playButton.querySelector('svg[data-test-id="icons-play"]');
    if (playButton == null || (isButtonCorrect == null && !isSeriesMoreInfoPage)) {
        return undefined;
    }
    const parentDiv = playButton.parentElement;
    const nativePartyButton = document.createElement("button");
    nativePartyButton.setAttribute("class", playButton.getAttribute("class"));
    nativePartyButton.setAttribute("style", `background: linear-gradient(273.58deg, #9E55A0 0%, #EF3E3A 100%); border-color: #e50914; color: #fff; ${!isSeriesMoreInfoPage ? "width: 180px; margin-top: 5px;" : ""}`);
    if (!isSeriesMoreInfoPage)
        playButton.setAttribute("style", "width: 180px");
    nativePartyButton.setAttribute("id", "native-party-button");
    nativePartyButton.innerHTML = "<span>Start a Teleparty</span>";
    parentDiv.insertBefore(nativePartyButton, playButton.nextSibling);
    return [{ button: nativePartyButton, play: (e) => playButton.click() }];
}
addNativePartyHandler(addNativePartyButton, InternalStreamingServiceName.TUBI_TV);

/******/ })()
;