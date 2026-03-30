import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseVmProps } from '@pages/content-management/presentation/adapters/terms-use/terms-use-vm-props.interface';

export class TermsUsePresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: TermsUseEntity): TermsUseVmProps {
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
