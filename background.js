chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockingEnabled: false });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleBlocking") {
        chrome.storage.sync.get("blockingEnabled", (data) => {
            const newValue = !data.blockingEnabled;
            chrome.storage.sync.set({ blockingEnabled: newValue }, () => {
                if (newValue) {
                    startBlocking();
                } else {
                    stopBlocking();
                }
            });
        });
    }
});

function startBlocking() {
    const blockUrls = [
        "*://*.zedo.com/*",
        "*://*.doubleclick.net/*",
        "*://*.ad.doubleclick.net/*",
        "*://*.ads.yahoo.com/*",
        "*://*.adserver.adtechus.com/*",
        "*://*.googlesyndication.com/*",
        "*://*.advertising.com/*",
        "*://*.bounceexchange.com/*",
        "*://*.openx.net/*",
        "*://*.adsrvr.org/*",
        "*://*.serving-sys.com/*"
        // Добавьте сюда другие нужные URL-адреса для блокировки
    ];

    chrome.webRequest.onBeforeRequest.addListener(
        blockRequest,
        { urls: blockUrls },
        ["blocking"]
    );
}

function stopBlocking() {
    chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
}

function blockRequest(details) {
    return { cancel: true };
}

chrome.storage.sync.get("blockingEnabled", (data) => {
    if (data.blockingEnabled) {
        startBlocking();
    }
});
