import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class TargetTypeRequiredError extends DomainError {
    readonly code = 'TARGET_TYPE_REQUIRED';
    readonly messageKey =
        'COMMUNICATION.MESSAGING.FORM.ERROR.TARGET_TYPE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'target type is required');
    }
}
