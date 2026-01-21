import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/services/app-customization.service';
import { LayoutService } from '@shared/services/layout.service';
import { NavService } from '@shared/services/nav.service';
import { LanguagesComponent } from './elements/languages/languages.component';
import { MyAccountComponent } from './elements/my-account/my-account.component';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [CommonModule, MyAccountComponent, LanguagesComponent, TranslateModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    public readonly config = inject(AppCustomizationService).config;

    constructor(
        public layout: LayoutService,
        public navServices: NavService,
        private router: Router
    ) { }

    public handleRefreshNotification(): void { }

    statusLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona';
    }
}
