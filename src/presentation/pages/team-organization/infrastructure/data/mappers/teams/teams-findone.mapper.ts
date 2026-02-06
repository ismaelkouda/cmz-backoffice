import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';
import { MapperUtils } from '@shared/utils/utils/mappers/mapper-utils';

import { TeamsFindOneEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-findone.entity';
import { TeamsTreeNodeEntity } from '@presentation/pages/team-organization/domain/entities/teams/teams-tree-node.entity';
import {
    PermissionApiDto,
    TeamsFindOneItemApiDto,
} from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-findone-response-api.dto';

@Injectable({ providedIn: 'root' })
export class TeamsFindOneMapper extends SimpleResponseMapper<
    TeamsFindOneEntity,
    TeamsFindOneItemApiDto
> {
    private readonly entityCache = new Map<string, TeamsFindOneEntity>();

    protected mapItemFromDto(dto: TeamsFindOneItemApiDto): TeamsFindOneEntity {
        MapperUtils.validateDto(dto, { required: ['code'] });

        const cacheKey =
            dto.code ?? this.buildPermissionsCacheKey(dto.permissions_json);

        const cached = this.entityCache.get(cacheKey);
        if (cached) {
            return cached;
        }

        const entity = new TeamsFindOneEntity(
            dto.id ?? undefined,
            dto.code ?? undefined,
            dto.name ?? undefined,
            dto.description ?? undefined,
            dto.report_types ?? undefined,
            dto.operators ?? undefined,
            dto.permissions_json.map((p) => this.mapPermissionNode(p))
        );

        this.entityCache.set(cacheKey, entity);
        return entity;
    }

    private mapPermissionNode(dto: PermissionApiDto): TeamsTreeNodeEntity {
        return new TeamsTreeNodeEntity(
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
