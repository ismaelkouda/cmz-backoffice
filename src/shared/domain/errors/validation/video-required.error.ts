import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class VideoRequiredError extends DomainError {
    readonly code = 'VIDEO_REQUIRED';
    readonly messageKey = 'COMMON.VIDEO.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'Video is required');
    }
}
