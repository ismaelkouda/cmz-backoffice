import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppCustomizationService } from '@shared/services/app-customization.service';
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
    public readonly collapseSidebar = input.required<boolean>();

    statusLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona';
    }
}
