import { RolesDto } from '@shared/data/dto/roles.dto';
import { SelectDto } from '@shared/data/dto/select.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ParticipantsFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: RolesDto | null;
    team: SelectDto | null;
    updated_at: string;
}

export type ParticipantsFindOneResponseApiDto =
    SimpleResponseDto<ParticipantsFindOneItemApiDto>;
