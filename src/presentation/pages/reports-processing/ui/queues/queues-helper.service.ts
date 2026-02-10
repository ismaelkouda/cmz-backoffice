import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class QueuesHelperService {
    getSweetAlertTitle(): string {
        return 'REPORTS_PROCESSING.QUEUES.SWEET_ALERT.TITLE_TAKE';
    }

    getSweetAlertMessage(): string {
        return 'REPORTS_PROCESSING.QUEUES.SWEET_ALERT.MESSAGE_TAKE';
    }
}
