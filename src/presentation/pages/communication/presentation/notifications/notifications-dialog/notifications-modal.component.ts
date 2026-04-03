import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-notifications-modal',
    templateUrl: './notifications-modal.component.html',
    styleUrls: ['./notifications-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TranslateModule],
})
export class NotificationsModalComponent implements OnInit {
    ngOnInit(): void {
        console.log('NotificationsModalComponent ngOnInit');
    }
}
