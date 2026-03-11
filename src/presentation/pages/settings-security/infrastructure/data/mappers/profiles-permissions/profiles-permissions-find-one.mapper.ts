import { Injectable } from '@angular/core';
import { ProfilesPermissionsFindOneEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-find-one.entity';
import { ProfilesPermissionsTreeNodeEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-tree-node.entity';
import {
    PermissionApiDto,
    ProfilesPermissionsFindOneItemApiDto,
} from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-response-api.dto';
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
        MapperUtils.validateDto(dto, { required: ['permissions'] });

        const cacheKey =
            dto.id ?? this.buildPermissionsCacheKey(dto.permissions);

        const cached = this.entityCache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const entity = new ProfilesPermissionsFindOneEntity(
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
    ): ProfilesPermissionsTreeNodeEntity {
        return new ProfilesPermissionsTreeNodeEntity(
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
