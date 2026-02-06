import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationManagerService {
    private translate = inject(TranslateService);

    private readonly SUPPORTED_LANGS = ['fr', 'en', 'es'];
    private readonly STORAGE_KEY = 'language';

    // Signals for modern reactivity
    private readonly currentLangSignal = signal<string>('fr');
    public currentLang = this.currentLangSignal.asReadonly();
    public readonly supportedLangs = signal<string[]>(
        this.SUPPORTED_LANGS
    ).asReadonly();

    private debugTranslationLoading(): void {
        console.log('🔍 Debug translation configuration:');
        console.log('- Default language:', this.translate.defaultLang);
        console.log('- Current language:', this.translate.getCurrentLang());
        console.log('- Supported languages:', this.translate.getLangs());
    }

    async initialize(): Promise<string> {
        try {
            const savedLang = localStorage.getItem(this.STORAGE_KEY);
            const browserLang = this.translate.getBrowserLang();
            const lang = this.determineInitialLanguage(savedLang, browserLang);

            console.log('🎯 Initializing translations with language:', lang);

            await this.loadLanguage(lang);
            this.currentLangSignal.set(lang);

            console.log(`✅ Translations initialized: ${lang}`);
            return lang;
        } catch (error) {
            console.error('❌ Translation initialization failed:', error);
            this.translate.use('fr');
            this.currentLangSignal.set('fr');
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
            console.log('🎯 Using saved language:', savedLang);
            return savedLang;
        }

        if (browserLang && this.isLanguageSupported(browserLang)) {
            console.log('🎯 Using browser language:', browserLang);
            return browserLang;
        }

        return 'fr';
    }

    private isLanguageSupported(lang: string): boolean {
        return this.SUPPORTED_LANGS.includes(lang);
    }

    async changeLanguage(lang: string): Promise<void> {
        if (!this.SUPPORTED_LANGS.includes(lang)) {
            throw new Error(`Unsupported language: ${lang}`);
        }
        console.log('🎯 Changing language to:', lang);

        return new Promise<void>((resolve, reject) => {
            this.translate.use(lang).subscribe({
                next: () => {
                    localStorage.setItem(this.STORAGE_KEY, lang);
                    this.currentLangSignal.set(lang);
                    resolve();
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    }
}
