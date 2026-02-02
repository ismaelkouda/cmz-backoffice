import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { ProfilsHabilitationsFindOneEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-findone.entity';
import { ProfilsHabilitationsTreeNodeEntity } from '@presentation/pages/settings-security/core/domain/entities/profils-habilitations/profils-habilitations-tree-node.entity';
import {
    PermissionApiDto,
    ProfilsHabilitationsFindOneItemApiDto,
} from '@presentation/pages/settings-security/infrastructure/api/dtos/profils-habilitations/profils-habilitations-findone-response-api.dto';

@Injectable({ providedIn: 'root' })
export class ProfilsHabilitationsFindOneMapper extends SimpleResponseMapper<
    ProfilsHabilitationsFindOneEntity,
    ProfilsHabilitationsFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilsHabilitationsFindOneEntity
    >();

    protected mapItemFromDto(
        dto: ProfilsHabilitationsFindOneItemApiDto
    ): ProfilsHabilitationsFindOneEntity {
        console.log('dto mapItemFromDto', dto.permissions);

        MapperUtils.validateDto(dto, { required: ['permissions'] });

        const cacheKey =
            dto.id ?? this.buildPermissionsCacheKey(dto.permissions);

        const cached = this.entityCache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const entity = new ProfilsHabilitationsFindOneEntity(
            dto.id ?? undefined,
            dto.name ?? undefined,
            dto.description ?? undefined,
            dto.permissions.map((p) => this.mapPermissionNode(p))
        );

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private mapPermissionNode(
        dto: PermissionApiDto
    ): ProfilsHabilitationsTreeNodeEntity {
        return new ProfilsHabilitationsTreeNodeEntity(
            dto.data.value,
            dto.data.title,
            dto.data.checked ?? false,
            dto.children?.map((c) => this.mapPermissionNode(c)) ?? []
        );
    }

    private buildPermissionsCacheKey(perms: PermissionApiDto[]): string {
        return 'perms:' + JSON.stringify(perms.map((p) => p.data.value));
    }
}
