import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
    selector: 'app-notifications-bell',
    templateUrl: './notifications-bell.component.html',
    styleUrls: ['./notifications-bell.component.scss'],
    imports: [OverlayBadgeModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsBellComponent {
    public readonly notificationsCount = input.required<number>();
}
