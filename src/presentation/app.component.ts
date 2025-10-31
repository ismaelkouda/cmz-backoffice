import { EnvService } from './../shared/services/env.service';
import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EncodingDataService } from '../shared/services/encoding-data.service';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    private document = inject(DOCUMENT);

    constructor(
        private translate: TranslateService,
        private envService: EnvService,
        private encodingService: EncodingDataService
    ) {
        const userLang = this.getUserLanguage();
        this.setDefaultLanguage(userLang);
        this.getAppSettings();
    }

    private getUserLanguage(): string {
        const browserLang = navigator.language || navigator.languages[0];
        const supportedLanguages = ['en', 'fr'];
        const previousLangSelected = localStorage.getItem('language');
        if (previousLangSelected) {
            return previousLangSelected;
        }
        return supportedLanguages.includes(browserLang) ? browserLang : 'fr';
    }

    private setDefaultLanguage(defaultLang: string): void {
        this.translate.use(defaultLang);
    }

    private getAppSettings(): void {
        const appSettings = this.envService.appSettings;
        this.setFavicon(appSettings.appLogoIcon);
        this.encodingService.saveData('app_settings', appSettings, true);
        console.log('appSettings', appSettings);
    }

    private setFavicon(appLogoIcon: string): void {
        const link = this.document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        link.href = appLogoIcon;

        this.document.head.appendChild(link);
    }
}
