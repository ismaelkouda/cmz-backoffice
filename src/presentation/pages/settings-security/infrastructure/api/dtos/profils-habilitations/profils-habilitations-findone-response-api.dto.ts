import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

import { PermissionTreeNodeApiDto } from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-tree-node-api.dto';

export interface PermissionApiDto {
    data: PermissionTreeNodeApiDto;
    children: PermissionApiDto[];
}

export interface ProfilsHabilitationsFindOneItemApiDto {
    id?: string;
    name?: string;
    description?: string;
    permissions: PermissionApiDto[];
}

export type ProfilsHabilitationsFindOneResponseApiDto =
    SimpleResponseDto<ProfilsHabilitationsFindOneItemApiDto>;
