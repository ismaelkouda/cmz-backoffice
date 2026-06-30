import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ContractRequiredError extends DomainError {
    readonly code = 'CONTRACT_REQUIRED';
    readonly messageKey = 'REPORT_STATES.DOWNLOAD.ERROR.CONTRACT.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'contract is required');
    }
}
