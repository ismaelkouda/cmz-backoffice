import { IProfilesPermissionActions } from '@pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-actions.interface';

export class TreeNodeEntity {
    constructor(
        public readonly key: string,
        public readonly value: string,
        public readonly label: string,
        public readonly checked = false,
        public readonly children: TreeNodeEntity[] = [],
        public readonly actions: IProfilesPermissionActions = {},
        public readonly availableActions: string[] = []
    ) {}

    get isLeaf(): boolean {
        return this.children.length === 0;
    }

    get hasChildren(): boolean {
        return this.children.length > 0;
    }
}
