import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    InvalidDateRangeError,
    InvalidEndDateError,
    InvalidStartDateError,
} from '@shared/domain/errors/date-period.error';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
    private readonly toastrService = inject(ToastrService);
    private readonly translateService = inject(TranslateService);

    success(key: string): void {
        this.toastrService.success(this.translateService.instant(key));
    }

    error(key: string): void {
        this.toastrService.error(this.translateService.instant(key));
    }

    notifyError(error: any): void {
        if (error instanceof InvalidDateRangeError) {
            this.error('COMMON.INVALID_DATE_RANGE');
        } else if (error instanceof InvalidStartDateError) {
            this.error('COMMON.INVALID_START_DATE');
        } else if (error instanceof InvalidEndDateError) {
            this.error('COMMON.INVALID_END_DATE');
        } else {
            this.error(error?.error?.message);
        }
    }
}
