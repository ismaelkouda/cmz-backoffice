import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService,
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('fr');

    const userLang = this.getUserLanguage();
    this.translate.use(userLang);
  }

  // translate(lang: string) {
  //   this.translateService.use(lang);
  //   this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  // }

  // Fonction pour obtenir la langue du navigateur
  private getUserLanguage(): string {
    const browserLang = navigator.language || navigator.languages[0];
    const supportedLanguages = ['en', 'fr'];
    const previousLangSelected = localStorage.getItem('language');
    if(previousLangSelected) {
      return previousLangSelected;
    }
    return supportedLanguages.includes(browserLang) ? browserLang : 'fr';
  }

}
