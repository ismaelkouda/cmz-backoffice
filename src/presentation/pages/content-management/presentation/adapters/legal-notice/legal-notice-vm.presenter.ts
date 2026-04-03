import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeVmProps } from '@pages/content-management/presentation/adapters/legal-notice/legal-notice-vm-props.interface';

export class LegalNoticePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: LegalNoticeEntity): LegalNoticeVmProps {
        return {
            uniqId: item.uniqId,
            version: item.version,
            status: item.status,
            statusLabel: this.t(item.status),
            statusStyle: item.statusStyle(item.status),
            createdAt: item.createdAt,
            publishedAt: item.publishedAt,
            actionsRef: item.actionsRef,
        };
    }
}
