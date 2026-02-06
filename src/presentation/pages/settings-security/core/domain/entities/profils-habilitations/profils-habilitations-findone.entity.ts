import { ProfilsHabilitationsTreeNodeEntity } from './profils-habilitations-tree-node.entity';

export class ProfilsHabilitationsFindOneEntity {
    constructor(
        public readonly id: string | undefined,
        public readonly name: string | undefined,
        public readonly description: string | undefined,
        public readonly permissions: ProfilsHabilitationsTreeNodeEntity[]
    ) {}
}
