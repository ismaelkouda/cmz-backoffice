import { MessagingUpdateValidateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.validate-contract';
import { MessagingChannelsEnum } from '@presentation/pages/communication/domain/enums/messaging/messaging-channels.enum';

export class MessagingUpdateEntity {
    constructor(private readonly contract: MessagingUpdateValidateContract) {}

    get data(): MessagingUpdateValidateContract {
        return this.contract;
    }

    hasSmsChannel(): boolean {
        return this.contract.channels.includes(MessagingChannelsEnum.SMS);
    }

    hasMailChannel(): boolean {
        return this.contract.channels.includes(MessagingChannelsEnum.MAIL);
    }

    hasPushChannel(): boolean {
        return this.contract.channels.includes(MessagingChannelsEnum.PUSH);
    }

    ensureCanBeUpdated(): void {
        this.ensureSmsContentLength();
        this.ensureMailSubject();
    }

    private ensureSmsContentLength(): void {
        if (this.hasSmsChannel() && this.contract.content.length > 160) {
            throw new Error('SMS content cannot exceed 160 characters');
        }
    }

    private ensureMailSubject(): void {
        if (this.hasMailChannel() && !this.contract.subject.trim()) {
            throw new Error('Subject is required for email channel');
        }
    }
}
