class VideoPlatformDetect {
    init() {
        chrome.runtime.onMessage.addListener((request) => {
            if (request.subject === "videoPlatformDetect") {
                this.setVideoPlatformDetect(request.data);
            }
        });

        fbdSingleDownloader.Utils.getActiveTab((tab) => {
            this.requestVideoPlatformDetect(tab.id);
        });
    }

    requestVideoPlatformDetect(tabId) {
        chrome.runtime.sendMessage({
            subject: "requestVideoPlatformDetect",
            tabId,
        });
    }

    setVideoPlatformDetect(data) {
        const score = data?.score ?? null;
        const container = document.getElementById("videoplatformdetect-wrapper");
        const indicator = document.getElementById("videoplatformdetect-info");

        if (indicator && container) {
            container.classList.remove("d-none");
            indicator.classList.remove("bg-secondary");
            indicator.innerHTML = score === null ? '' : 'supported';

            if (score === null) {
                indicator.classList.add("bg-secondary");
            } else if (score >= 80) {
                indicator.classList.add("bg-success");
            } else if (score >= 50) {
                indicator.classList.add("bg-warning");
            } else {
                indicator.classList.add("bg-danger");
            }
        }
    }
}

const videoPlatformDetect = new VideoPlatformDetect();
