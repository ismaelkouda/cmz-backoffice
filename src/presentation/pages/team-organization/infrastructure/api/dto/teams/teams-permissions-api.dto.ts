import { PermissionTreeNodeApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-tree-node-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TeamsPermissionsItemApiDto {
    data: PermissionTreeNodeApiDto;
    children: TeamsPermissionsItemApiDto[];
}

export type TeamsPermissionsResponseApiDto = SimpleResponseDto<
    TeamsPermissionsItemApiDto[]
>;
