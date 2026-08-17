import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ReportIdRequiredError extends DomainError {
    readonly code = 'REPORT_ID_REQUIRED';
    readonly messageKey =
        'COMMUNICATION.MESSAGING.FORM.ERROR.REPORT_ID.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'report id is required');
    }
}
