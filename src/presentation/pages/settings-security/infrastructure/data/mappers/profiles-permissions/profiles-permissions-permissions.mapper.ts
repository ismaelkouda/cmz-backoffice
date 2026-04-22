import { Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { ProfilesPermissionsPermissionsItemApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-permissions-api.dto';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsMapper extends SimpleResponseMapper<
    ProfilesPermissionsPermissionsEntity,
    ProfilesPermissionsPermissionsItemApiDto[]
> {
    private readonly entityCache = new Map<
        string,
        ProfilesPermissionsPermissionsEntity
    >();

    protected mapItemFromDto(
        dto: ProfilesPermissionsPermissionsItemApiDto[]
    ): ProfilesPermissionsPermissionsEntity {
        // MapperUtils.validateDto(dto, { required: ['data'] });
        const permissions = dto.map((p) => this.mapPermissionNode(p));

        const props = { permissions };

        const cacheKey = this.buildPermissionsCacheKey(dto);

        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new ProfilesPermissionsPermissionsEntity(props);

        this.entityCache.set(cacheKey, entity);

        return entity;
    }

    private mapPermissionNode(
        dto: ProfilesPermissionsPermissionsItemApiDto
    ): TreeNodeEntity {
        return new TreeNodeEntity(
            dto.data.value,
            dto.data.value,
            dto.data.title,
            dto.data.checked ?? false,
            dto.children?.map((c) => this.mapPermissionNode(c)) ?? []
        );
    }

    private buildPermissionsCacheKey(
        perms: ProfilesPermissionsPermissionsItemApiDto[]
    ): string {
        return 'perms:' + JSON.stringify(perms);
    }
}
