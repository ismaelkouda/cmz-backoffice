import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MESSAGING_ROUTE } from '@pages/communication/communication.routes';
import { COMMUNICATION_ROUTE } from '@shared/routes/routes';

@Injectable({
    providedIn: 'root',
})
export class MessagingFormHelperService {
    private readonly router = inject(Router);

    navigateToMessagingList(): void {
        this.router.navigate([COMMUNICATION_ROUTE + '/' + MESSAGING_ROUTE]);
    }

    getSweetAlertTitle(isEditMode: boolean): string {
        return isEditMode
            ? 'COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE_UPDATE'
            : 'COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE_CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE_UPDATE'
            : 'COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE_CREATE';
    }
}
