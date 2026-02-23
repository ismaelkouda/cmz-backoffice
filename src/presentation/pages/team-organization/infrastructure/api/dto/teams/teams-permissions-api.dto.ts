import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PermissionTreeNodeApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-tree-node-api.dto';

export interface TeamsPermissionsItemApiDto {
    data: PermissionTreeNodeApiDto;
    children: TeamsPermissionsItemApiDto[];
}

export type TeamsPermissionsResponseApiDto = SimpleResponseDto<
    TeamsPermissionsItemApiDto[]
>;
