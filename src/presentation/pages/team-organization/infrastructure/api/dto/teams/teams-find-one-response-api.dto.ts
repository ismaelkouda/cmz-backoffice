import { PermissionApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-response-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TeamsFindOneItemApiDto {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    report_types?: string[];
    operators?: string[];
    permissions_json: PermissionApiDto[];
}

export type TeamsFindOneResponseApiDto =
    SimpleResponseDto<TeamsFindOneItemApiDto>;
