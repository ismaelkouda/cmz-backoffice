import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { PermissionTreeNodeApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-tree-node-api.dto';

export interface TeamsPermissionsItemApiDto {
    data: PermissionTreeNodeApiDto;
    children: TeamsPermissionsItemApiDto[];
}

export type TeamsPermissionsResponseApiDto = SimpleResponseDto<
    TeamsPermissionsItemApiDto[]
>;
