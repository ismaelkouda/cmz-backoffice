import { Injectable } from '@angular/core';
import { ProfilesPermissionsPermissionsEntity } from '@pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-permissions.entity';
import { PermissionApiDto } from '@pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-find-one-response-api.dto';
import { TreeNodeEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-tree-node.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

@Injectable({ providedIn: 'root' })
export class ProfilesPermissionsPermissionsMapper extends SimpleResponseMapper<
    ProfilesPermissionsPermissionsEntity,
    PermissionApiDto[]
> {
    private readonly entityCache = new Map<
        string,
        ProfilesPermissionsPermissionsEntity
    >();

    protected mapItemFromDto(
        dto: PermissionApiDto[]
    ): ProfilesPermissionsPermissionsEntity {
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

    private mapPermissionNode(dto: PermissionApiDto): TreeNodeEntity {
        const children = (dto.children ?? []).map((child) =>
            this.mapPermissionNode(child)
        );

        const ownActions = dto.data.actions;

        const hasOwnActions =
            !!ownActions && Object.keys(ownActions).length > 0;

        const availableActions: string[] = hasOwnActions
            ? Object.keys(ownActions)
            : this.extractAvailableActionsFromChildren(children);

        const actions: Record<string, boolean> = hasOwnActions
            ? { ...ownActions }
            : this.buildDefaultActions(availableActions);

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
            child.availableActions.forEach((action) => actionsSet.add(action));
        });

        return Array.from(actionsSet);
    }

    private buildDefaultActions(
        availableActions: string[]
    ): Record<string, boolean> {
        const result: Record<string, boolean> = {};

        availableActions.forEach((action) => {
            result[action] = false;
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
