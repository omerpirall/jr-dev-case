/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

if (!window.videoIdScriptLoaded) {
    console.log("Browse script loaded");
    window.videoIdScriptLoaded = true;
    window.addEventListener("AmazonVideoMessage", function (evt) {
        var type = evt.detail.type;
        if (type === "getVideoId") {
            const videoId = findTitle();
            if (videoId) {
                const newEvent = new CustomEvent("FromNode", {
                    detail: { type: "VideoId", videoId: videoId, updatedAt: new Date().getTime() },
                });
                window.dispatchEvent(newEvent);
            }
        }
        else if (type === "getVideoLookupData") {
            const titleEls = document.querySelectorAll(".atvwebplayersdk-title-text");
            let title;
            [...titleEls].forEach((titleEl) => {
                if (titleEl) {
                    title = titleEl.textContent;
                }
            });
            const altTitleEl = document.querySelector('[data-automation-id="title"]');
            if (!title && altTitleEl) {
                title = altTitleEl.textContent;
            }
            const nextEl = document.querySelector(".atvwebplayersdk-nexttitle-button");
            const type = nextEl ? "TV" : "MOVIE";
            let episodeYear = undefined;
            let releaseYear = undefined;
            const yearEl = document.querySelector('[data-automation-id="release-year-badge"]');
            if (yearEl) {
                if (type === "TV") {
                    episodeYear = yearEl.textContent;
                }
                else {
                    releaseYear = yearEl.textContent;
                }
            }
            const newEvent = new CustomEvent("FromNode", {
                detail: {
                    type: "GetLookupData",
                    data: { title, type, episodeYear, releaseYear },
                },
            });
            window.dispatchEvent(newEvent);
        }
    });
    var findTitle = function () {
        try {
            const elementRoots = document.querySelectorAll(".atvwebplayersdk-title-text");
            let elementRoot = null;
            let elementRootFallback = null;
            // in some countries, there are multiple title components. Only one of them will actually contain
            // inner text. we want to find that one
            for (var i = 0; i < elementRoots.length; i++) {
                if (elementRoots[i].innerText) {
                    elementRoot = elementRoots[i];
                }
                else if (elementRoots[i].clientHeight > 0) {
                    // if the element has a height, it's likely the one we want as a fallback
                    elementRootFallback = elementRoots[i];
                }
            }
            if (elementRoot == null) {
                if (elementRoots.length === 0) {
                    return null;
                }
                // Sometimes, the proper title doesn't have the text showing (if the player width is less than 1/2 the screen
                // width, for instance). It's still there sometimes, however. So we fall back to the 0th list element if we find nothing
                /*
                    webPlayerUIContainer: there may be 2 instances of this, one for the player and one for the fullscreen player
                    ie dv-web-player-2
                    This happens when the player width is less than 1/2 the screen width (as indicated above)

                    When this happens, react titleId is only available in the last instance of webPlayerUIContainer (otherwise its null)
                    so we use the elementRootFallback in that case

                    */
                elementRoot = elementRootFallback || elementRoots[0];
            }
            const keys = Object.keys(elementRoot);
            let key = null;
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].startsWith("__reactInternalInstance")) {
                    key = keys[i];
                    break;
                }
            }
            // also found at  .webPlayerUIContainer._reactRootContainer._internalRoot.current.memoizedState.element.props.context.pin.currentTitleId
            // const sectionPath = elementRoot[key].stateNode.current.memoizedState.element.props.state.action.atf
            // const titlePath = Object.values(sectionPath)[0].watchPartyAction.endpoint.query.titleId
            //const section_path = elementRoot[key].return.return.stateNode.context.stores.downloadedMetadata.titleInfoStore.player.currentTitleId
            //All videos contain the returnedTitleRendition.asin; This leads to an ID that gets the correct season and episode number (not the same as the one in the URL)
            //I believe that the returnedTitleRendition ID is good enough, however, because we want amzn1. ID we can use a path that is found in majority of the videos
            //I've looked through about 20+ videos and I've only found 1 that didn't have a catalog.id (it had the returnedTitleRendition.asin)
            //So I've decided to use the returnedTitleRendition.asin as a fallback since it works perfectly for the purposes of a videoID.
            //My recommendation is that we use the returnedTitleRendition.asin as it is unique to each episoe and will take us to the right destination 10/10 times
            //const titlePath = elementRoot[key].return.return.stateNode.context.stores.adPlayback.player.ui.xrayController.controller.metricsFeature.mediaEventController.acquisitionMediaEventController.titleId
            const titlePath = elementRoot[key].return.return.stateNode.context.stores.pin.currentTitleId ||
                elementRoot[key].return.return.stateNode.context.stores.pin.clickstreamReporter.asin;
            if (titlePath) {
                return titlePath;
            }
            /*

            These methods return the amazon global title id
            format: amzn1.dv.gti.<unique id>
            and they should still work in the URLs as usual

            */
            var titleId = null;
            // Fallback: dv-player-fullscreen React root
            var el = document.querySelector(".dv-player-fullscreen");
            if (el === null || el === void 0 ? void 0 : el._reactRootContainer) {
                titleId =
                    el._reactRootContainer._internalRoot.current.child.stateNode.props.context.config.webPlayer
                        .currentTitleId;
                if (titleId)
                    return titleId;
            }
            // Fallback: draper-player-container
            el = document.querySelector(".draper-player-container");
            if (el === null || el === void 0 ? void 0 : el._reactRootContainer) {
                titleId =
                    el._reactRootContainer._internalRoot.current.child.stateNode.props.context.config.webPlayer
                        .currentTitleId;
                if (titleId)
                    return titleId;
            }
            return null;
        }
        catch (err) {
            return undefined;
        }
    };
}
const getReactInternals = (root) => {
    if (root == null) {
        return null;
    }
    var keys = Object.keys(root);
    var key = null;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith("__reactInternalInstance")) {
            key = keys[i];
            break;
        }
    }
    return key ? root[key] : null;
};
const getProps = () => {
    const parentEls = document.querySelectorAll(".webPlayerSDKContainer");
    let el = null;
    [...parentEls].forEach((parentEl) => {
        var _a;
        if ((_a = parentEl.querySelector("video")) === null || _a === void 0 ? void 0 : _a.src) {
            el = parentEl;
        }
    });
    return getReactInternals(el.querySelector(".atvwebplayersdk-bottompanel-container")).return.memoizedState;
};
/*

use the following to get the props of the player/DOM objects as needed

  function safeCompare(a, b) {
    // If both values are objects (and not null), compare by reference.
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      return a === b;
    }
    // Otherwise, use loose equality.
    return a == b;
  }

  function findProperties(obj, searchTerm, path = '', seen = new WeakSet()) {
    let results = [];

    // If it's not an object or is null, nothing to search.
    if (typeof obj !== 'object' || obj === null) {
      return results;
    }

    // Avoid circular references.
    if (seen.has(obj)) {
      return results;
    }
    seen.add(obj);

    for (let key in obj) {
      // Use Object.prototype.hasOwnProperty.call to safely check for own properties.
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      // Build the full path for this property.
      const currentPath = path ? `${path}.${key}` : key;

      // If the key matches or the value (if primitive) matches the search term, add it to results.
      if (key === searchTerm || (typeof obj[key] !== 'object' && safeCompare(obj[key], searchTerm))) {
        results.push({ path: currentPath, value: obj[key] });
      }

      // Recurse into the property.
      results = results.concat(findProperties(obj[key], searchTerm, currentPath, seen));
    }

    return results;
  }

  */
const getPropsAlt = () => {
    var _a, _b, _c, _d, _e;
    try {
        const parentEls = document.querySelectorAll(".webPlayerSDKContainer");
        let el = null;
        [...parentEls].forEach((parentEl) => {
            var _a;
            if ((_a = parentEl.querySelector("video")) === null || _a === void 0 ? void 0 : _a.src) {
                el = parentEl;
            }
        });
        if (!el) {
            el = document;
        }
        /*
        the main .atvwebplayersdk-player-container props don't seem to update Ad info during Ad breaks (during playback)
        so we also have to get the Ad info from the .webPlayerUIContainer react props, which seems to retain this info in all states
        */
        //props.adType is no longer defined in rootAdProps
        let rootAdProps = (_a = el.querySelector(".webPlayerUIContainer")) === null || _a === void 0 ? void 0 : _a._reactRootContainer._internalRoot.current.memoizedState.element.props.context.adPlayback;
        let rootTimelineProps = (_b = el.querySelector(".webPlayerUIContainer")) === null || _b === void 0 ? void 0 : _b._reactRootContainer._internalRoot.current.child.stateNode.props.context.seekBar.seekBar;
        let rootPlayProps = (_c = el.querySelector(".webPlayerUIContainer")) === null || _c === void 0 ? void 0 : _c._reactRootContainer._internalRoot.current.child.memoizedState;
        if (!el.querySelector(".webPlayerUIContainer")) {
            const altEl = document.querySelector(".dv-player-fullscreen");
            if (altEl) {
                rootAdProps =
                    altEl === null || altEl === void 0 ? void 0 : altEl._reactRootContainer._internalRoot.current.memoizedState.element.props.context.adPlayback;
                rootTimelineProps =
                    altEl === null || altEl === void 0 ? void 0 : altEl._reactRootContainer._internalRoot.current.child.stateNode.props.context.seekBar.seekBar;
                rootPlayProps = altEl === null || altEl === void 0 ? void 0 : altEl._reactRootContainer._internalRoot.current.child.memoizedState;
            }
        }
        let rootMainProps = null;
        try {
            rootMainProps = (_d = getReactInternals(el.querySelector(".atvwebplayersdk-player-container"))) === null || _d === void 0 ? void 0 : _d.child.child.child.child.sibling.child.return.sibling.sibling.sibling.memoizedState;
        }
        catch (_f) {
            rootMainProps = (_e = getReactInternals(el.querySelector(".atvwebplayersdk-player-container"))) === null || _e === void 0 ? void 0 : _e.child.child.child.child.sibling.sibling.sibling.memoizedState;
        }
        let playbackProps = Object.assign(Object.assign({}, rootMainProps), { currentAdInfo: (rootAdProps === null || rootAdProps === void 0 ? void 0 : rootAdProps.currentAdInfo) || null });
        if (!(playbackProps === null || playbackProps === void 0 ? void 0 : playbackProps.lastPlayablePositionMs) && (rootTimelineProps === null || rootTimelineProps === void 0 ? void 0 : rootTimelineProps.lastPlayablePositionMs)) {
            // use fallback props
            playbackProps.lastPlayablePositionMs = rootTimelineProps.lastPlayablePositionMs;
            playbackProps.positionMs = rootTimelineProps.positionMs;
        }
        if (rootPlayProps === null || rootPlayProps === void 0 ? void 0 : rootPlayProps.playbackState) {
            // use fallback props if necessary
            // if state is undefined, use the one from the main props
            if ((playbackProps === null || playbackProps === void 0 ? void 0 : playbackProps.state) === undefined) {
                playbackProps.state = rootPlayProps.playbackState;
            }
        }
        return playbackProps;
    }
    catch (err) {
        return null;
    }
};
function updateState(event) {
    if (event.source == window && event.data.type === "UpdateState") {
        const props = getPropsAlt();
        if (props) {
            const evt = new CustomEvent("FromNode", {
                detail: {
                    type: "UpdateState",
                    duration: props.lastPlayablePositionMs,
                    currentTime: props.positionMs,
                    state: props.state,
                    adPlaying: props.currentAdInfo !== null,
                    updatedAt: Date.now(),
                },
            });
            window.dispatchEvent(evt);
        }
    }
}
window.addEventListener("message", updateState, false);

/******/ })()
;