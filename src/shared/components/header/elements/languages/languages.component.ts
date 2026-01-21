import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslationManagerService } from '@core/services/translation-manager.service';
import { TranslateModule } from '@ngx-translate/core';

interface LanguageOption {
    code: string;
    label: string;
    flag: string;
}

@Component({
    selector: 'app-languages',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguagesComponent {
    private readonly translationService = inject(TranslationManagerService);

    public isDropdownOpen = signal(false);

    public readonly languages: LanguageOption[] = [
        { code: 'fr', label: 'LANGUAGES.FR', flag: 'https://flagcdn.com/w40/fr.png' },
        { code: 'en', label: 'LANGUAGES.EN', flag: 'https://flagcdn.com/w40/gb.png' },
        { code: 'es', label: 'LANGUAGES.ES', flag: 'https://flagcdn.com/w40/es.png' },
    ];

    public currentLanguage = this.translationService.currentLang;

    public toggleDropdown(): void {
        this.isDropdownOpen.update(v => !v);
    }

    public closeDropdown(): void {
        this.isDropdownOpen.set(false);
    }

    public async selectLanguage(langCode: string): Promise<void> {
        console.log('Selected language:', langCode);
        await this.translationService.changeLanguage(langCode);
        this.closeDropdown();
    }

    public getFlagUrl(code: string): string {
        const lang = this.languages.find(l => l.code === code);
        return lang ? lang.flag : '';
    }
}
