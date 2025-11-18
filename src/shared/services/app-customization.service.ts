import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_CUSTOMIZATION } from './app-customization.config';
import {
    setDocumentTitle,
    setFavicon,
    setLayoutDirection,
    setMetaTags,
    setThemeColors,
} from './app-customization.dom';
import { AppCustomizationConfig } from './app-customization.interface';
import { EnvService } from './env.service';

/**
 * Service de personnalisation de l'application
 * Centralise toutes les configurations personnalisables de l'application
 * Utilise les valeurs de appSettings depuis EnvService ou les valeurs par défaut
 */
@Injectable({
    providedIn: 'root',
})
export class AppCustomizationService {
    private readonly document: Document;
    private readonly titleService: Title;
    private readonly translate: TranslateService;
    private readonly envService: EnvService;

    /**
     * Configuration actuelle de personnalisation
     */
    public readonly config: AppCustomizationConfig;

    constructor() {
        this.document = inject(DOCUMENT);
        this.titleService = inject(Title);
        this.translate = inject(TranslateService);
        this.envService = inject(EnvService);
        
        // Fusionner la configuration par défaut avec les valeurs de appSettings
        this.config = this.mergeConfigurations();
        // Appliquer la personnalisation immédiatement
        this.applyCustomization();
    }

    /**
     * Fusionne la configuration par défaut avec les valeurs de appSettings
     * @private
     * @returns {AppCustomizationConfig} Configuration fusionnée
     */
    private mergeConfigurations(): AppCustomizationConfig {
        const appSettings = this.envService.appSettings || {};

        return {
            app: {
                name: appSettings.appName || DEFAULT_CUSTOMIZATION.app.name,
                title: appSettings.appName
                    ? `${appSettings.appName} Back-office`
                    : DEFAULT_CUSTOMIZATION.app.title,
                description: DEFAULT_CUSTOMIZATION.app.description,
                keywords: DEFAULT_CUSTOMIZATION.app.keywords,
                author: DEFAULT_CUSTOMIZATION.app.author,
                lang: DEFAULT_CUSTOMIZATION.app.lang,
            },
            colors: {
                primary:
                    appSettings.appPrimaryColor ||
                    DEFAULT_CUSTOMIZATION.colors.primary,
                secondary:
                    appSettings.appSecondaryColor ||
                    DEFAULT_CUSTOMIZATION.colors.secondary,
                tertiary:
                    appSettings.appTertiaryColor ||
                    DEFAULT_CUSTOMIZATION.colors.tertiary,
                error: DEFAULT_CUSTOMIZATION.colors.error,
                warning: DEFAULT_CUSTOMIZATION.colors.warning,
                success: DEFAULT_CUSTOMIZATION.colors.success,
                info: DEFAULT_CUSTOMIZATION.colors.info,
                loadingBar:
                    appSettings.appPrimaryColor ||
                    DEFAULT_CUSTOMIZATION.colors.loadingBar,
            },
            languages: DEFAULT_CUSTOMIZATION.languages,
            layout: DEFAULT_CUSTOMIZATION.layout,
            assets: {
                favicon:
                    appSettings.appLogoIcon ||
                    DEFAULT_CUSTOMIZATION.assets.favicon,
                logoFull:
                    appSettings.appLogoFull ||
                    DEFAULT_CUSTOMIZATION.assets.logoFull,
                logoIcon:
                    appSettings.appLogoIcon ||
                    DEFAULT_CUSTOMIZATION.assets.logoIcon,
            },
            loadingBar: {
                color:
                    appSettings.appPrimaryColor ||
                    DEFAULT_CUSTOMIZATION.loadingBar.color,
                height: DEFAULT_CUSTOMIZATION.loadingBar.height,
                includeSpinner: DEFAULT_CUSTOMIZATION.loadingBar.includeSpinner,
            },
            error: {
                ...DEFAULT_CUSTOMIZATION.error,
                displayStyles: {
                    ...DEFAULT_CUSTOMIZATION.error.displayStyles,
                    background:
                        appSettings.appPrimaryColor ||
                        DEFAULT_CUSTOMIZATION.error.displayStyles.background,
                },
            },
            performance: DEFAULT_CUSTOMIZATION.performance,
        };
    }

    /**
     * Applique la personnalisation à l'application
     * Configure le titre, les couleurs CSS, le favicon, etc.
     * @public
     * @returns {void}
     */
    public applyCustomization(): void {
        setDocumentTitle(this.document, this.titleService, this.config);
        setFavicon(this.document, this.config);
        setThemeColors(this.document, this.config);
        setLayoutDirection(this.document, this.config);
        setMetaTags(this.document, this.config);
    }

    /**
     * Obtient la langue de l'utilisateur
     * Priorité : localStorage > langue du navigateur > langue par défaut
     * @public
     * @returns {string} Code de langue
     */
    public getUserLanguage(): string {
        const {
            supported,
            default: defaultLang,
            storageKey,
        } = this.config.languages;

        try {
            // Vérifier si une langue a été précédemment sélectionnée
            const previousLangSelected = localStorage.getItem(storageKey);
            if (
                previousLangSelected &&
                supported.includes(previousLangSelected)
            ) {
                return previousLangSelected;
            }

            // Utiliser la langue du navigateur si supportée
            const browserLang =
                navigator.language || navigator.languages?.[0] || '';
            const browserLangCode = browserLang.split('-')[0]?.toLowerCase();

            if (browserLangCode && supported.includes(browserLangCode)) {
                return browserLangCode;
            }

            return defaultLang;
        } catch (error) {
            console.error(
                'Erreur lors de la récupération de la langue:',
                error
            );
            return defaultLang;
        }
    }

    /**
     * Configure la langue par défaut de l'application
     * @public
     * @param {string} lang - Code de langue
     * @returns {void}
     */
    public setDefaultLanguage(lang: string): void {
        try {
            this.translate.use(lang);
            localStorage.setItem(this.config.languages.storageKey, lang);
        } catch (error) {
            console.error(
                'Erreur lors de la configuration de la langue:',
                error
            );
        }
    }
}
