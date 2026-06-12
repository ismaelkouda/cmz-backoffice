import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerRegistry } from '@shared/domain/services/error-handler-registry.service';
import { UnauthorizedError } from '@shared/domain/errors/http/unauthorized.error';
import { PasswordRequiredError } from '../errors/validation/password-required.error';
import { DomainError } from '../errors/domain-error.abstract';
import { DateRangeInvalidError } from '../errors/validation/date-range-invalid.error';
import { ForbiddenError } from '../errors/http/forbidden.error';
import { NotFoundError } from '../errors/http/not-found.error';
import { ValidationError } from '../errors/http/validation.error';
import { ServerError } from '../errors/http/server.error';
import { UnknownError } from '../errors/http/unknown.error';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
    private readonly toast = inject(ToastrService);
    private readonly translate = inject(TranslateService);
    private readonly registry = inject(ErrorHandlerRegistry);
    private readonly sessionService = inject(SessionService);

    constructor() {
        this.registerDefaultHandlers();
    }

    private registerDefaultHandlers(): void {
        this.registry.register(ForbiddenError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });

        this.registry.register(NotFoundError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });

        this.registry.register(ValidationError, (error) => {
            this.toast.error(error.message);
        });

        this.registry.register(ServerError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });

        this.registry.register(UnknownError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });

        this.registry.register(UnauthorizedError, (error) => {
            this.toast.warning(this.translate.instant(error.message));
            this.sessionService.clear();
        });

        this.registry.register(PasswordRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(DateRangeInvalidError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
    }

    success(key: string): void {
        this.toast.success(this.translate.instant(key));
    }

    error(key: string): void {
        this.toast.error(this.translate.instant(key));
    }

    notifyError(error: DomainError): void {
        this.registry.handle(error);
    }
}
