import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '@core/config/config.tokens';
import { TranslateService } from '@ngx-translate/core';
import {
    setDocumentTitle,
    setFavicon,
    setFonts,
    setMetaTags,
    setThemeColors,
} from '@shared/domain/services/app-customization/app-customization.dom';

import { createAppCustomization } from './app-customization.factory';

@Injectable({ providedIn: 'root' })
export class AppCustomizationService {
    private readonly document = inject(DOCUMENT);
    private readonly titleService = inject(Title);
    private readonly translate = inject(TranslateService);

    private readonly config = inject(APP_CONFIG);

    public readonly customization = createAppCustomization(this.config);

    public applyCustomization(): void {
        setDocumentTitle(this.document, this.titleService, this.customization);
        setFavicon(this.document, this.customization);
        setThemeColors(this.document, this.customization);
        setFonts(this.document, this.customization);
        setMetaTags(this.document, this.customization);
    }

    public getUserLanguage(): string {
        const {
            supported,
            default: defaultLang,
            storageKey,
        } = this.customization.languages;

        const stored = localStorage.getItem(storageKey);
        if (stored && supported.includes(stored)) {
            return stored;
        }

        const browserLang =
            navigator.language || navigator.languages?.[0] || '';

        const code = browserLang.split('-')[0]?.toLowerCase();

        if (code && supported.includes(code)) {
            return code;
        }

        return defaultLang;
    }

    public getUserMode(): string {
        const {
            supported,
            default: defaultMode,
            storageKey,
        } = this.customization.modes;

        const stored = localStorage.getItem(storageKey);
        if (stored && supported.includes(stored)) {
            return stored;
        }

        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        const mode = prefersDark ? 'dark' : 'light';

        return supported.includes(mode) ? mode : defaultMode;
    }

    public setDefaultLanguage(lang: string): void {
        this.translate.use(lang);
        localStorage.setItem(this.customization.languages.storageKey, lang);
    }

    public setDefaultMode(mode: string): void {
        localStorage.setItem(this.customization.modes.storageKey, mode);
    }

    public listenToSystemMode(): void {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        mediaQuery.addEventListener('change', (event) => {
            const newMode = event.matches ? 'dark' : 'light';

            const stored = localStorage.getItem(
                this.customization.modes.storageKey
            );

            if (!stored || stored === 'system') {
                this.setDefaultMode(newMode);
            }
        });
    }
}
