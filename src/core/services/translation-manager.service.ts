import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationManagerService {
    private translate = inject(TranslateService);

    private readonly SUPPORTED_LANGS = ['fr', 'en', 'es'];
    private readonly STORAGE_KEY = 'imako_lang';

    private debugTranslationLoading(): void {
        console.log('🔍 Debug translation configuration:');
        console.log('- Default language:', this.translate.defaultLang);
        console.log('- Current language:', this.translate.currentLang);
        console.log('- Supported languages:', this.translate.getLangs());

        // Test direct dans le navigateur
        if (typeof window !== 'undefined') {
            fetch('/assets/i18n/fr.json')
                .then((response) => {
                    console.log(
                        '📦 Direct fetch result:',
                        response.status,
                        response.statusText
                    );
                    return response.json();
                })
                .then((data) =>
                    console.log('📄 Translation file content:', data)
                )
                .catch((error) =>
                    console.error('❌ Direct fetch failed:', error)
                );
        }
    }

    async initialize(): Promise<string> {
        try {
            const savedLang = localStorage.getItem(this.STORAGE_KEY);
            const browserLang = this.translate.getBrowserLang();
            const lang = this.determineInitialLanguage(savedLang, browserLang);

            console.log('🎯 Initializing translations with language:', lang);

            this.translate.setDefaultLang('fr');

            await this.loadLanguage(lang);

            console.log(`✅ Translations initialized: ${lang}`);
            return lang;
        } catch (error) {
            console.error('❌ Translation initialization failed:', error);

            this.translate.use('fr');
            return 'fr';
        }
    }

    private async loadLanguage(lang: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.translate.use(lang).subscribe({
                next: () => resolve(),
                error: (error) => {
                    console.error(`❌ Failed to load language ${lang}:`, error);
                    reject(error);
                },
            });
        });
    }

    private determineInitialLanguage(
        savedLang: string | null,
        browserLang: string | undefined
    ): string {
        if (savedLang && this.isLanguageSupported(savedLang)) {
            return savedLang;
        }

        if (browserLang && this.isLanguageSupported(browserLang)) {
            return browserLang;
        }

        return 'fr';
    }

    private isLanguageSupported(lang: string): boolean {
        return this.SUPPORTED_LANGS.includes(lang);
    }

    getCurrentLang(): string {
        return this.translate.currentLang;
    }

    getSupportedLangs(): string[] {
        return this.SUPPORTED_LANGS;
    }

    async changeLanguage(lang: string): Promise<void> {
        if (!this.SUPPORTED_LANGS.includes(lang)) {
            throw new Error(`Unsupported language: ${lang}`);
        }

        return new Promise<void>((resolve, reject) => {
            this.translate.use(lang).subscribe({
                next: () => {
                    localStorage.setItem(this.STORAGE_KEY, lang);
                    resolve();
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    }
}
