import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';

import { HistoryVmProps } from './history-vm-props.interface';

export class HistoryPresenter {
    map(item: HistoryEntity): HistoryVmProps {
        return {
            uniqId: item.id,
            actionType: item.actionType,
            action: item.action,
            source: `${item.ipAddress} - [${item.initiator?.phone}] ${item.initiator?.lastName} ${item.initiator?.firstName}`,
            createdAt: item.createdAt,
            actionsRef: item.actionType,
        };
    }
}
