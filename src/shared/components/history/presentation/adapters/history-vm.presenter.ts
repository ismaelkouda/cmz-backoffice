import { HistoryEntity } from '@shared/components/history/domain/entities/history.entity';

import { HistoryVmProps } from './history-vm-props.interface';

export class HistoryPresenter {
    map(item: HistoryEntity): HistoryVmProps {
        return {
            uniqId: item.uniqId,
            actionType: item.actionType,
            action: item.action,
            source: item.source,
            createdAt: item.createdAt,
            actionsRef: item.actionType,
        };
    }
}
