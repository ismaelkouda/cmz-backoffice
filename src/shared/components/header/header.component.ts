import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsFacade } from '@presentation/pages/communication/application/services/notifications/notifications.facade';
import { AppCustomizationService } from '@shared/domain/services/app-customization.service';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

import { LanguagesComponent } from './elements/languages/languages.component';
import { MyAccountComponent } from './elements/my-account/my-account.component';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        MyAccountComponent,
        LanguagesComponent,
        TranslateModule,
        OverlayBadgeModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    public readonly config = inject(AppCustomizationService).config;
    public readonly collapseSidebar = input.required<boolean>();
    private readonly facade = inject(NotificationsFacade);
    readonly count = this.facade.unreadCount;

    ngOnInit(): void {
        console.log('count: ', this.count());
    }

    statusLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona';
    }
}
