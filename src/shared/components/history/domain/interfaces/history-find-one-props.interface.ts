import { ActorEntity } from '@shared/domain/entities/actor.entity';

import { HistoryDataItemApiDto } from '../../infrastructure/api/dto/history-find-one-response-api.dto';
import { HistoryChangeType } from '../enums/history-change-type.enum';
import { HistoryEventType } from '../enums/history-event-type.enum';

export interface HistoryFieldChange {
    key: string;
    previousValue: unknown | null;
    currentValue: unknown | null;
    changeType: HistoryChangeType;
}

export interface HistoryFindOneProps {
    uniqId: string;
    createdAt: string;
    event: HistoryEventType;
    rawEvent: string;
    action: string;
    module: string;
    accessMethod?: string;
    sourceIp?: string;
    user: ActorEntity | null;
    rawData?: HistoryDataItemApiDto[];
    changes: HistoryFieldChange[];
    timestamps: {
        createdAt: string;
        updatedAt?: string;
    };
}
