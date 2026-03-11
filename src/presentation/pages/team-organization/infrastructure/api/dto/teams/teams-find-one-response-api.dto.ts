import { PermissionTreeNodeApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-tree-node-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface PermissionApiDto {
    data: PermissionTreeNodeApiDto;
    children: PermissionApiDto[];
}

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
