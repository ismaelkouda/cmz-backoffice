import { ActorDto } from '@shared/data/dto/actor.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface HistoryItemApiDto {
    id: string;
    type_action: string;
    action: string;
    ip_address: string;
    initiator: ActorDto;
    created_at: string;
}

export type HistoryResponseApiDto = PaginatedResponseDto<HistoryItemApiDto>;
