// Блокируемые домены
const AD_DOMAINS = [
    "doubleclick.net", 
    "googlesyndication.com",
    "ads.example.com",
    "cdn.flashbanner.com"
];

// Генерация правил блокировки
function generateRules() {
    const rules = [];
    let id = 1;

    // 1. Блокировка по доменам
    AD_DOMAINS.forEach(domain => {
        rules.push({
            id: id++,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: `||${domain}^`,
                resourceTypes: ["script", "image", "stylesheet", "xmlhttprequest"]
            }
        });
    });

    // 2. Блокировка Flash/SWF
    rules.push(
        {
            id: id++,
            priority: 1,
            action: { type: "redirect", redirect: { extensionPath: "/empty.html" } },
            condition: {
                urlFilter: "*.swf",
                resourceTypes: ["object", "other"]
            }
        },
        {
            id: id++,
            priority: 1,
            action: { type: "block" },
            condition: {
                urlFilter: "||adobe.com/flash^",
                resourceTypes: ["script"]
            }
        }
    );

    // 3. Скрытие рекламных блоков
    rules.push({
        id: id++,
        priority: 2,
        action: {
            type: "modifyHeaders",
            responseHeaders: [{
                header: "Content-Security-Policy",
                operation: "set",
                value: "default-src 'self'"
            }]
        },
        condition: { urlFilter: "*", resourceTypes: ["main_frame"] }
    });

    return rules;
}

// Инициализация
chrome.runtime.onInstalled.addListener(async () => {
    await chrome.storage.sync.set({ adblockEnabled: true });
    await updateRules(true);
});

// Обновление правил
async function updateRules(enable) {
    const currentRules = await chrome.declarativeNetRequest.getDynamicRules();
    const removeIds = currentRules.map(rule => rule.id);

    if (enable) {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: removeIds,
            addRules: generateRules()
        });
    } else {
        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: removeIds
        });
    }
}

// Обработчик сообщений
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleAdblock") {
        chrome.storage.sync.get("adblockEnabled", async (data) => {
            const newValue = !data.adblockEnabled;
            await chrome.storage.sync.set({ adblockEnabled: newValue });
            await updateRules(newValue);
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === "hideBanners") {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            files: ["content-script.js"]
        });
    }
});
