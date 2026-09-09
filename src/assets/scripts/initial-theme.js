(function () {
    try {
        var env = window.__env || {};
        var root = document.documentElement;
        var primaryColor = env.appPrimaryColor || '#2256a3';
        var fontPrimary =
            env.appFontPrimary || "'Avenir', 'Futura', sans-serif";

        root.style.setProperty('--theme-default', primaryColor);
        root.style.setProperty('--font-primary', fontPrimary);
    } catch (e) {
        console.error('Error setting initial styles', e);
    }
})();