import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class PlatformsRequiredError extends DomainError {
    readonly code = 'PLATFORMS_REQUIRED';
    readonly messageKey = 'COMMON.PLATFORMS.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'At least one platform must be selected');
    }
}
