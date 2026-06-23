import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class MunicipalityRequiredError extends DomainError {
    readonly code = 'MUNICIPALITY_REQUIRED';
    readonly messageKey =
        'COMMUNICATION.MESSAGING.FORM.ERROR.MUNICIPALITY.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'municipality is required');
    }
}
