import { PermissionTreeNodeApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-tree-node-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ProfilesPermissionsPermissionsItemApiDto {
    data: PermissionTreeNodeApiDto;
    children: ProfilesPermissionsPermissionsItemApiDto[];
}

export type ProfilesPermissionsPermissionsResponseApiDto = SimpleResponseDto<
    ProfilesPermissionsPermissionsItemApiDto[]
>;
