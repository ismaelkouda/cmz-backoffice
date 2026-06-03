import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    InvalidDateRangeError,
    InvalidEndDateError,
    InvalidStartDateError,
} from '@shared/domain/errors/date-period/date-period.error';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerRegistry } from '@shared/domain/services/error-handler-registry.service';
import { UnauthorizedError } from '@shared/domain/errors/http/unauthorized.error';

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
    private readonly toast = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly registry = inject(ErrorHandlerRegistry);

    constructor() {
        this.registerDefaultHandlers();
    }

    private registerDefaultHandlers(): void {
        this.registry.register('422', (error) => {
            this.toast.error(this.translate.instant(error.messageKey));
        });

        this.registry.register(UnauthorizedError, (error) => {
            this.toast.warning(this.translate.instant(error.messageKey));
            // redirection login
        });

        // Handler générique si aucun trouvé
    }

    success(key: string): void {
        this.toast.success(this.translate.instant(key));
    }

    error(key: string): void {
        this.toast.error(this.translate.instant(key));
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
