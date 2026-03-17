/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;
(function () {
    const getReactInternals = (root) => {
        if (root == null) {
            return null;
        }
        var keys = Object.keys(root);
        var key = null;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("__reactFiber$")) {
                key = keys[i];
                break;
            }
        }
        return key ? root[key] : null;
    };
    const getInternalPlayerApi = () => {
        try {
            const el = document.querySelector('[data-testid="pips-wrapper"]');
            const fiber = getReactInternals(el);
            return fiber === null || fiber === void 0 ? void 0 : fiber.return.return.return.memoizedProps;
        }
        catch (e) {
            return null;
        }
    };
    const getNextEpisodeApi = () => {
        try {
            return getReactInternals(document.querySelector(".playback-binge__container")).return.memoizedProps;
        }
        catch (e) {
            return undefined;
        }
    };
    var messageHandler = function (e) {
        var _a, _b;
        try {
            if (e.source == window) {
                const messageType = e.data.type;
                if (messageType === "GetState") {
                    const internalApi = getInternalPlayerApi();
                    let playbackPosition, duration, playerState;
                    if (internalApi) {
                        playbackPosition = internalApi.playbackPosition;
                        duration = internalApi.duration;
                        playerState = internalApi.playerState;
                    }
                    else {
                        const video = document.querySelector("video");
                        if (video) {
                            playbackPosition = video.currentTime;
                            duration = video.duration;
                            if (video.readyState < 4) {
                                playerState = "Buffering";
                            }
                            else if (video.paused) {
                                playerState = "Paused";
                            }
                            else {
                                playerState = "Playing";
                            }
                        }
                    }
                    const evt = new CustomEvent("FromNode", {
                        detail: {
                            type: "UpdateState",
                            playbackPosition: playbackPosition,
                            duration: duration,
                            playerState: playerState,
                            updatedAt: Date.now(),
                        },
                    });
                    window.dispatchEvent(evt);
                }
                else if (messageType === "Seek") {
                    const internalApi = getInternalPlayerApi();
                    if (internalApi && internalApi.seek) {
                        internalApi.seek(e.data.time);
                    }
                }
                else if (messageType === "GetStartOfCredits") {
                    const internalApi = getInternalPlayerApi();
                    const startOfCredits = ((_b = (_a = internalApi === null || internalApi === void 0 ? void 0 : internalApi.assetMetadata) === null || _a === void 0 ? void 0 : _a.bestFormat) === null || _b === void 0 ? void 0 : _b.startOfCredits) || 0;
                    const evt = new CustomEvent("FromNode", {
                        detail: {
                            type: "StartOfCredits",
                            startOfCredits: startOfCredits,
                            updatedAt: Date.now(),
                        },
                    });
                    window.dispatchEvent(evt);
                }
                else if (messageType === "NextEpisode") {
                    const nextEpisodeApi = getNextEpisodeApi();
                    const nextEpisodeId = `${nextEpisodeApi.bingePopUpAsset.contentId}/${nextEpisodeApi.bingePopUpAsset.providerVariantId}`;
                    const evt = new CustomEvent("FromNode", {
                        detail: {
                            type: "NextEpisode",
                            nextEpisodeId,
                            updatedAt: Date.now(),
                        },
                    });
                    window.dispatchEvent(evt);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    if (!window.injectScriptLoaded) {
        window.injectScriptLoaded = true;
        console.log("Loaded TP Peacock Injected");
        window.addEventListener("message", messageHandler, !1);
    }
})();

/******/ })()
;