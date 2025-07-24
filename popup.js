document.addEventListener("DOMContentLoaded", async () => {
    const toggle = document.getElementById("toggle");
    const status = document.getElementById("status");
    const hideBtn = document.getElementById("hideBtn");

    // Загрузка состояния
    const data = await chrome.storage.sync.get("adblockEnabled");
    toggle.checked = data.adblockEnabled ?? true;
    status.textContent = toggle.checked ? "Enabled" : "Disabled";

    // Переключение
    toggle.addEventListener("change", async () => {
        await chrome.storage.sync.set({ adblockEnabled: toggle.checked });
        status.textContent = toggle.checked ? "Enabled" : "Disabled";
        chrome.runtime.sendMessage({ action: "toggleAdblock" });
    });

    // Скрытие баннеров
    hideBtn.addEventListener("click", async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab?.id) {
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content-script.js"]
                });
                console.log("Banners hidden successfully");
            } catch (error) {
                console.error("Failed to hide banners:", error);
            }
        }
    });
});