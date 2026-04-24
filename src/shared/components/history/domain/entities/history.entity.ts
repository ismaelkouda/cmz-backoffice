import { HistoryProps } from '@shared/components/history/domain/interfaces/history-props.interface';
import { ActorEntity } from '@shared/domain/entities/actor.entity';

export class HistoryEntity {
    constructor(private readonly props: HistoryProps) {}

    get id(): string {
        return this.props.id;
    }
    get actionType(): string {
        return this.props.actionType;
    }
    get action(): string {
        return this.props.action;
    }
    get initiator(): ActorEntity | null {
        return this.props.initiator;
    }
    get ipAddress(): string | null {
        return this.props?.ip_address || null;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }

    public with(props: HistoryProps): HistoryEntity {
        if (this.createdAt === props.createdAt && this.id === props.id) {
            return this;
        }
        return new HistoryEntity(props);
    }
}
