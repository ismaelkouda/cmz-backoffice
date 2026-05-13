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
        const children = (dto.children ?? []).map((child) =>
            this.mapPermissionNode(child)
        );

        const ownActions = dto.data.actions ?? {};

        const hasOwnActions = Object.keys(ownActions).length > 0;

        const availableActions = hasOwnActions
            ? Object.keys(ownActions)
            : this.extractAvailableActionsFromChildren(children);

        const actions = hasOwnActions
            ? { ...ownActions }
            : this.buildDefaultActionsFromCheckedState(
                  availableActions,
                  dto.data.checked ?? false
              );

        return new TreeNodeEntity(
            dto.data.value,
            dto.data.value,
            dto.data.title,
            dto.data.checked ?? false,
            children,
            actions,
            availableActions
        );
    }

    private extractAvailableActionsFromChildren(
        children: TreeNodeEntity[]
    ): string[] {
        const actionsSet = new Set<string>();

        children.forEach((child) => {
            child.availableActions.forEach((action) => {
                actionsSet.add(action);
            });
        });

        return Array.from(actionsSet);
    }

    private buildDefaultActionsFromCheckedState(
        availableActions: string[],
        checked: boolean
    ): Record<string, boolean> {
        const result: Record<string, boolean> = {};

        availableActions.forEach((action) => {
            result[action] = checked;
        });

        return result;
    }

    private buildPermissionsCacheKey(permissions: PermissionApiDto[]): string {
        return (
            'permissions:' +
            JSON.stringify(permissions.map((node) => node.data.value))
        );
    }
}
