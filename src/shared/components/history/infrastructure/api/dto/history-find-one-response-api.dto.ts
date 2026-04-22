import { ActorDto } from '@shared/data/dto/actor.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export type HistoryDataItemApiDto =
    | {
          key: string;
          value: unknown;
      }
    | {
          key: string;
          previous_value: unknown;
          current_value: unknown;
      };
export interface HistoryFindOneItemApiDto {
    id: string;
    created_at: string;
    event: string;
    action: string;
    module: string;
    sous_module: string;
    ip_address: string;
    type_action: string;
    initiator: ActorDto;
    agent_use: string;
    data?: HistoryDataItemApiDto[];
    updated_at: string;
}

export type HistoryFindOneResponseApiDto =
    SimpleResponseDto<HistoryFindOneItemApiDto>;
