document.addEventListener("DOMContentLoaded", () => {
    const checkBox = document.querySelector('input[type="checkbox"][name="blockRequest"]');

    if (checkBox) {
        // Получаем текущее состояние блокировки при открытии попапа
        chrome.storage.sync.get("blockingEnabled", (data) => {
            checkBox.checked = data.blockingEnabled;
        });

        checkBox.addEventListener("change", () => {
            chrome.runtime.sendMessage({ action: "toggleBlocking" });
        });
    } else {
        console.error("Чекбокс не найден");
    }
});
