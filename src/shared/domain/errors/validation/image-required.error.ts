import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ImageRequiredError extends DomainError {
    readonly code = 'IMAGE_REQUIRED';
    readonly messageKey = 'COMMON.IMAGE.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Image is required');
    }
}
