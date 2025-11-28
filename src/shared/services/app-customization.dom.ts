import { Title } from '@angular/platform-browser';
import { AppCustomizationConfig } from './app-customization.interface';
import { getDynamicTitle } from './app-customization.utils';

export function setDocumentTitle(
    document: Document,
    titleService: Title,
    config: AppCustomizationConfig
): void {
    const title = getDynamicTitle(config.app.title);
    titleService.setTitle(title);
    document.title = title;
}

export function setFavicon(
    document: Document,
    config: AppCustomizationConfig
): void {
    try {
        const existingFavicon = document.querySelector('link[rel="icon"]');
        if (existingFavicon) {
            existingFavicon.remove();
        }

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = config.assets.favicon;
        link.dataset['favicon'] = 'app-favicon';

        document.head.appendChild(link);
    } catch (error) {
        console.error('Erreur lors de la configuration du favicon:', error);
    }
}

function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return '91, 155, 213'; // Valeur par défaut
    }
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
}

export function setFonts(
    document: Document,
    config: AppCustomizationConfig
): void {
    try {
        const root = document.documentElement;
        root.style.setProperty('--font-primary', config.fonts.primary);
        root.style.setProperty('--font-secondary', config.fonts.secondary);
    } catch (error) {
        console.error('Erreur lors de la configuration des polices:', error);
    }
}

export function setThemeColors(
    document: Document,
    config: AppCustomizationConfig
): void {
    try {
        const root = document.documentElement;

        // Couleurs principales
        root.style.setProperty('--theme-default', config.colors.primary);
        root.style.setProperty('--theme-secondary', config.colors.secondary);
        root.style.setProperty('--theme-tertiary', config.colors.tertiary);

        // Couleurs neutres
        root.style.setProperty('--color-black', config.colors.black);
        root.style.setProperty('--color-white', config.colors.white);
        root.style.setProperty('--color-gray', config.colors.gray);
        root.style.setProperty('--color-gray-light', config.colors.grayLight);

        // Couleurs d'état
        root.style.setProperty('--color-error', config.colors.error);
        root.style.setProperty('--color-warning', config.colors.warning);
        root.style.setProperty('--color-success', config.colors.success);
        root.style.setProperty('--color-info', config.colors.info);

        // Valeurs RGB pour utilisation avec rgba()
        root.style.setProperty(
            '--theme-default-rgb',
            hexToRgb(config.colors.primary)
        );
        root.style.setProperty(
            '--theme-secondary-rgb',
            hexToRgb(config.colors.secondary)
        );
        root.style.setProperty(
            '--color-error-rgb',
            hexToRgb(config.colors.error)
        );
        root.style.setProperty(
            '--color-warning-rgb',
            hexToRgb(config.colors.warning)
        );
        root.style.setProperty(
            '--color-success-rgb',
            hexToRgb(config.colors.success)
        );
        root.style.setProperty(
            '--color-info-rgb',
            hexToRgb(config.colors.info)
        );

        // Couleur de la loading bar
        root.style.setProperty('--loading-bar-color', config.loadingBar.color);

        // Assets
        root.style.setProperty('--login-bg', `url('${config.assets.loginBg}')`);
    } catch (error) {
        console.error('Erreur lors de la configuration des couleurs:', error);
    }
}

export function setLayoutDirection(
    document: Document,
    config: AppCustomizationConfig
): void {
    try {
        if (config.layout.type === 'rtl') {
            document.documentElement.setAttribute('dir', config.layout.type);
        }
    } catch (error) {
        console.error(
            'Erreur lors de la configuration de la direction:',
            error
        );
    }
}

function setOrUpdateMetaTag(
    document: Document,
    name: string,
    content: string
): void {
    let meta = document.querySelector(`meta[name="${name}"]`);

    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
}

export function setMetaTags(
    document: Document,
    config: AppCustomizationConfig
): void {
    try {
        setOrUpdateMetaTag(document, 'description', config.app.description);

        setOrUpdateMetaTag(document, 'keywords', config.app.keywords);

        setOrUpdateMetaTag(document, 'author', config.app.author);

        setOrUpdateMetaTag(document, 'theme-color', config.colors.primary);
    } catch (error) {
        console.error('Erreur lors de la configuration des meta tags:', error);
    }
}
