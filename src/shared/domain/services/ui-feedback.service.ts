import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import {
    InvalidDateRangeError,
    InvalidEndDateError,
    InvalidStartDateError,
} from '@shared/domain/errors/date-period.error';

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
    private readonly toastrService = inject(ToastrService);
    private readonly translateService = inject(TranslateService);

    success(key: string): void {
        this.toastrService.success(this.translateService.instant(key));
    }

    error(key: string): void {
        console.log('key: ', key);
        this.toastrService.error(this.translateService.instant(key));
    }

    notifyError(error: unknown): void {
        console.log('error: ', typeof error);
        if (error instanceof InvalidDateRangeError) {
            this.error('COMMON.INVALID_DATE_RANGE');
        } else if (error instanceof InvalidStartDateError) {
            this.error('COMMON.INVALID_START_DATE');
        } else if (error instanceof InvalidEndDateError) {
            this.error('COMMON.INVALID_END_DATE');
        } else if ((error as any)?.error?.message) {
            this.error((error as any).error.message);
        } else {
            this.error('COMMON.INVALID_DATE_RANGE');
        }
    }
}
