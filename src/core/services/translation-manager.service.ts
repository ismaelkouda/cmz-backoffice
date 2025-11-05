import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationManagerService {
  private translate = inject(TranslateService);
  
  private readonly SUPPORTED_LANGS = ['fr', 'en', 'es'];
  private readonly STORAGE_KEY = 'imako_lang';

  async initialize(): Promise<string> {
    const savedLang = localStorage.getItem(this.STORAGE_KEY);
    const browserLang = this.translate.getBrowserLang();
    
      const lang = this.determineInitialLanguage(savedLang, browserLang);

    this.translate.setDefaultLang('fr');
    
    return new Promise<string>((resolve) => {
      this.translate.use(lang).subscribe({
        next: () => {
          console.log(`🌍 Translations initialized: ${lang}`);
          resolve(lang);
        },
        error: (error) => {
          console.error('❌ Translation initialization failed:', error);
          this.translate.use('fr').subscribe({
            next: () => resolve('fr'),
            error: () => resolve('fr')
          });
        }
      });
    });
  }

    private determineInitialLanguage(savedLang: string | null, browserLang: string | undefined): string {
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
        }
      });
    });
  }
}