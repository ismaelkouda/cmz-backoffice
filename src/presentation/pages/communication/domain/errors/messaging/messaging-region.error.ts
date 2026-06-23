import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class RegionRequiredError extends DomainError {
    readonly code = 'REGION_REQUIRED';
    readonly messageKey = 'COMMUNICATION.MESSAGING.FORM.ERROR.REGION.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'region is required');
    }
}
