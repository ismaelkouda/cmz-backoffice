import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';

import {
    TeamsPermissionsEntity,
    TeamsPermissionsProps,
} from '@presentation/pages/team-organization/domain/entities/teams/teams-permissions.entity';
import { TeamsPermissionsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-permissions-api.dto';

@Injectable({ providedIn: 'root' })
export class TeamsPermissionsMapper extends SimpleResponseMapper<
    TeamsPermissionsEntity,
    TeamsPermissionsItemApiDto[]
> {
    private readonly entityCache = new Map<string, TeamsPermissionsEntity>();

    protected mapItemFromDto(
        dto: TeamsPermissionsItemApiDto[]
    ): TeamsPermissionsEntity {
        // MapperUtils.validateDto(dto, { required: ['data'] });
        const permissions = dto.map((p) => this.mapPermissionNode(p));

        const props: TeamsPermissionsProps = { permissions };

        const cacheKey = this.buildPermissionsCacheKey(dto);

        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props)
            : new TeamsPermissionsEntity(props);

        this.entityCache.set(cacheKey, entity);

        return entity;
    }

    private mapPermissionNode(dto: TeamsPermissionsItemApiDto): TreeNodeEntity {
        return new TreeNodeEntity(
            dto.data.value,
            dto.data.title,
            dto.data.checked ?? false,
            dto.children?.map((c) => this.mapPermissionNode(c)) ?? []
        );
    }

    private buildPermissionsCacheKey(
        perms: TeamsPermissionsItemApiDto[]
    ): string {
        return 'perms:' + JSON.stringify(perms);
    }
}
