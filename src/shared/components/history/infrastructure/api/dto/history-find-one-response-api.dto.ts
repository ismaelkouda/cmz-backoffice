import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface HistoryFindOneItemApiDto {
    id: string;
    user: string;
    address_ip: string;
    action: string;
    module: string;
    used_agent: string;
    created_at: string;
    updated_at: string;
    data?: { key: string; value: string }[];
}

export type HistoryFindOneResponseApiDto =
    SimpleResponseDto<HistoryFindOneItemApiDto>;
