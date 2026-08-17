import { DomainError } from '@shared/domain/errors/domain-error.abstract';

export class ChannelsRequiredError extends DomainError {
    readonly code = 'CHANNELS_REQUIRED';
    readonly messageKey =
        'COMMUNICATION.MESSAGING.FORM.ERROR.CHANNELS.REQUIRED';
    readonly statusCode = 422;
    constructor(message?: string) {
        super(message || 'channels is required');
    }
}
