(function() {
    // Список селекторов для скрытия (объявляем один раз)
    const adSelectors = [
        'div[class*="banner"]',
        'div[class*="ad"]',
        'iframe[src*="ads"]',
        'object[type*="flash"]',
        'embed[type*="flash"]'
    ];

    // Собираем все элементы
    const adElements = [];
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.style.transition = "opacity 0.5s";
            el.style.opacity = "0.5";
            adElements.push(el);
        });
    });

    // Плавное скрытие через 300ms
    setTimeout(() => {
        adElements.forEach(el => {
            el.style.display = 'none';
            el.innerHTML = '';
        });
        console.log(`Hidden ${adElements.length} ads`);
    }, 300);
})();