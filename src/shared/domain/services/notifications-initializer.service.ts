import { inject, Injectable } from '@angular/core';
import { NotificationsFacade } from '@pages/communication/application/services/notifications/notifications.facade';

@Injectable({ providedIn: 'root' })
export class NotificationsInitializer {
    private readonly facade = inject(NotificationsFacade);
    constructor() {
        this.facade.execute();
    }
}
