(function () {
    try {
        var env = window.__env || {};
        var root = document.documentElement;
        var primaryColor = env.appPrimaryColor || '#2256a3';
        var fontPrimary =
            env.appFontPrimary || "'Avenir', 'Futura', sans-serif";

        root.style.setProperty('--theme-default', primaryColor);
        // Le thème SCSS lit la variante historique '--theme-deafult' :
        // la poser dès le pre-boot pour éviter un flash de mauvaise couleur.
        root.style.setProperty('--theme-deafult', primaryColor);
        root.style.setProperty('--font-primary', fontPrimary);
    } catch (e) {
        console.error('Error setting initial styles', e);
    }
})();