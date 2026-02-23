import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { PermissionTreeNodeApiDto } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-tree-node-api.dto';

export interface ProfilesPermissionsPermissionsItemApiDto {
    data: PermissionTreeNodeApiDto;
    children: ProfilesPermissionsPermissionsItemApiDto[];
}

export type ProfilesPermissionsPermissionsResponseApiDto = SimpleResponseDto<
    ProfilesPermissionsPermissionsItemApiDto[]
>;
