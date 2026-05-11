import { Injectable } from '@angular/core';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import {
    PermissionApiDto,
    ProfilesPermissionsFindOneItemApiDto,
} from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-response-api.dto';
import { TreeNodeEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-tree-node.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsFindOneMapper extends SimpleResponseMapper<
    ProfilesPermissionsFindOneEntity,
    ProfilesPermissionsFindOneItemApiDto
> {
    private readonly entityCache = new Map<
        string,
        ProfilesPermissionsFindOneEntity
    >();

    protected mapItemFromDto(
        dto: ProfilesPermissionsFindOneItemApiDto
    ): ProfilesPermissionsFindOneEntity {
        MapperUtils.validateDto(dto, {
            required: ['permissions'],
        });

        const cacheKey =
            dto.uniq_id ?? this.buildPermissionsCacheKey(dto.permissions);

        const cachedEntity = this.entityCache.get(cacheKey);

        if (cachedEntity) {
            return cachedEntity;
        }

        const entity = new ProfilesPermissionsFindOneEntity(
            dto.uniq_id,
            dto.name,
            dto.description,
            dto.permissions.map((node) => this.mapPermissionNode(node))
        );

        this.entityCache.set(cacheKey, entity);

        return entity;
    }

    private mapPermissionNode(dto: PermissionApiDto): TreeNodeEntity {
        return new TreeNodeEntity(
            dto.data.value,
            dto.data.value,
            dto.data.title,
            dto.data.checked ?? false,
            (dto.children ?? []).map((child) => this.mapPermissionNode(child)),
            { ...(dto.data.actions ?? {}) }
        );
    }

    private buildPermissionsCacheKey(permissions: PermissionApiDto[]): string {
        return (
            'permissions:' +
            JSON.stringify(permissions.map((node) => node.data.value))
        );
    }
}
