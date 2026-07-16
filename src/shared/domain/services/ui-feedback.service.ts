import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerRegistry } from '@shared/domain/services/error-handler-registry.service';
import { UnauthorizedError } from '@shared/domain/errors/http/unauthorized.error';
import { PasswordRequiredError } from '../errors/validation/password-required.error';
import { GenericRequiredError } from '../errors/validation/generic.error';
import { DomainError } from '../errors/domain-error.abstract';
import { DateRangeInvalidError } from '../errors/validation/date-range-invalid.error';
import { ForbiddenError } from '../errors/http/forbidden.error';
import { NotFoundError } from '../errors/http/not-found.error';
import { ValidationError } from '../errors/http/validation.error';
import { ServerError } from '../errors/http/server.error';
import { UnknownError } from '../errors/http/unknown.error';
import { SessionService } from './session.service';
import { AccountLockedError } from '../errors/http/account-locked.error';
import {
    InvalidDateRangeError,
    InvalidStartDateError,
    InvalidEndDateError,
} from '../errors/date-period/date-period.error';
import { TypeRequiredError } from '../errors/validation/type-required.error';
import { ConfirmPasswordNoMatchError } from '../errors/validation/confirm-password.error';
import { DownloadTypeRequiredError } from '../errors/validation/download-type.error';
import { InvalidEmailError } from '../errors/validation/invalid-email.error';
import { ConfirmPasswordRequiredError } from '../errors/validation/confirm-password-required.error';
import { EmailRequiredError } from '../errors/validation/email-required.error';
import { ContractRequiredError as CloseContractRequiredError } from '@pages/report-states/domain/errors/close/close-contract.error';
import { ContractRequiredError as RejectContractRequiredError } from '@pages/report-states/domain/errors/reject/reject-contract.error';
import { StatusTypeRequiredError as RejectStatusTypeRequiredError } from '@pages/report-states/domain/errors/reject/reject-status-type.error';
import { ContractRequiredError as ApproveContractRequiredError } from '@pages/report-states/domain/errors/approve/approve-contract.error';
import { ContractRequiredError as EvaluateContractRequiredError } from '@pages/report-states/domain/errors/evaluate/evaluate-contract.error';
import { ReportIdRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-report-id.error';
import { UniqIdRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-uniq-id.error';
import { TargetTypeRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-target-type.error';
import { SubjectRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-subject.error';
import { ChannelsRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-channels.error';
import { TypeRequiredError as MessagingTypeRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-type.error';
import { ContentRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-content.error';
import { RegionRequiredError } from '@presentation/pages/communication/domain/errors/messaging/messaging-region.error';

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
        this.registry.register(AccountLockedError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });

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
        this.registry.register(GenericRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(DateRangeInvalidError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });

        // Ajoutes Expérience 020 (check-semantics.js, regle 3) : 30 classes DomainError
        // reellement levees dans l'app (verifie par grep, pas suppose) et jusque-la sans
        // handler enregistre — meme bug que GenericRequiredError/DateRangeInvalidError
        // (Expérience 008/012), mais pour d'autres modules (communication/messaging,
        // report-states) et les validateurs partages (shared/domain/errors/validation/*).
        this.registry.register(InvalidDateRangeError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(InvalidStartDateError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(InvalidEndDateError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(TypeRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(ConfirmPasswordNoMatchError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(DownloadTypeRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(InvalidEmailError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(ConfirmPasswordRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(EmailRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(CloseContractRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(RejectContractRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(RejectStatusTypeRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(ApproveContractRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(EvaluateContractRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(ReportIdRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(UniqIdRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(TargetTypeRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(SubjectRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(ChannelsRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(MessagingTypeRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(ContentRequiredError, (error) => {
            this.toast.error(this.translate.instant(error.message));
        });
        this.registry.register(RegionRequiredError, (error) => {
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
