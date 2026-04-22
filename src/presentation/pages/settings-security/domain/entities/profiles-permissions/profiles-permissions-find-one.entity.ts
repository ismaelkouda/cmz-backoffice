import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';

export class ProfilesPermissionsFindOneEntity {
    constructor(
        public readonly id: string | undefined,
        public readonly name: string | undefined,
        public readonly description: string | undefined,
        public readonly permissions: TreeNodeEntity[]
    ) {}
}
