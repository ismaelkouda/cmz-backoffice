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
            ? 'COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE.EDIT'
            : 'COMMUNICATION.MESSAGING.SWEET_ALERT.TITLE.CREATE';
    }

    getSweetAlertMessage(isEditMode: boolean): string {
        return isEditMode
            ? 'COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE.EDIT'
            : 'COMMUNICATION.MESSAGING.SWEET_ALERT.MESSAGE.CREATE';
    }
}
