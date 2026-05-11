import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { TreeNode } from 'primeng/api';

export type PermissionActionsApiDto = Record<string, boolean>;
export interface PermissionTreeNodeApiDto extends TreeNode {
    value: string;
    title: string;
    slug?: string;
    checked: boolean;
    actions?: PermissionActionsApiDto;
}
export interface PermissionApiDto {
    data: PermissionTreeNodeApiDto;
    children?: PermissionApiDto[];
}

export interface ProfilesPermissionsFindOneItemApiDto {
    uniq_id?: string;
    name?: string;
    description?: string;
    permissions: PermissionApiDto[];
}

export type ProfilesPermissionsFindOneResponseApiDto =
    SimpleResponseDto<ProfilesPermissionsFindOneItemApiDto>;
