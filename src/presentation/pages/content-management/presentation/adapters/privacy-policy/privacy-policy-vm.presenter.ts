import { PrivacyPolicyEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';
import { PrivacyPolicyVmProps } from '@pages/content-management/presentation/adapters/privacy-policy/privacy-policy-vm-props.interface';

export class PrivacyPolicyPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: PrivacyPolicyEntity): PrivacyPolicyVmProps {
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
