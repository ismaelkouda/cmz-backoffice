import { ActorEntity } from '@shared/domain/entities/actor.entity';

export interface HistoryProps {
    id: string;
    actionType: string;
    action: string;
    initiator: ActorEntity | null;
    ip_address: string | null;
    createdAt: string;
}
