import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsFacade } from '@pages/communication/application/services/notifications/notifications.facade';
import { LanguagesComponent } from '@shared/components/header/elements/languages/languages.component';
import { MyAccountComponent } from '@shared/components/header/elements/my-account/my-account.component';
import { NotificationsBellComponent } from '@shared/components/header/elements/notifications-bell/notifications-bell.component';
import { AppCustomizationService } from '@shared/domain/services/app-customization/app-customization.service';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        MyAccountComponent,
        LanguagesComponent,
        NotificationsBellComponent,
        TranslateModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
    public readonly config = inject(AppCustomizationService).customization;
    public readonly collapseSidebar = input.required<boolean>();
    private readonly facade = inject(NotificationsFacade);
    readonly count = this.facade.unreadCount;

    ngOnInit(): void {
        this.facade.execute();
    }

    statusLayout(): boolean {
        return localStorage.getItem('layout') === 'Barcelona';
    }
}
