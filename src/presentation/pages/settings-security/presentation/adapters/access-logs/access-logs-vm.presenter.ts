import { AccessLogsEntity } from '@pages/settings-security/domain/entities/access-logs/access-logs.entity';
import { AccessLogsVmProps } from '@pages/settings-security/presentation/adapters/access-logs/access-logs-vm-props.interface';

export class AccessLogsPresenter {
    constructor(private readonly t: (key: string) => string) {}

    map(item: AccessLogsEntity): AccessLogsVmProps {
        return {
            uniqId: item.uniqId,
            action: item.action,
            source: item.source,
            usedAgent: item.usedAgent,
            createdAt: item.createdAt,
            actionsRef: item.action,
        };
    }
}
