import { PermissionTreeNodeApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-tree-node-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface PermissionApiDto {
    data: PermissionTreeNodeApiDto;
    children: PermissionApiDto[];
}

export interface ProfilesPermissionsFindOneItemApiDto {
    id?: string;
    name?: string;
    description?: string;
    permissions: PermissionApiDto[];
}

export type ProfilesPermissionsFindOneResponseApiDto =
    SimpleResponseDto<ProfilesPermissionsFindOneItemApiDto>;
