import { TreeNodeEntity } from '@shared/domain/entities/tree-node.entity';

export class TeamsFindOneEntity {
    constructor(
        public readonly id: string | null,
        public readonly code: string | undefined,
        public readonly name: string | undefined,
        public readonly description: string | undefined,
        public readonly reportTypes: string[] | undefined,
        public readonly operators: string[] | undefined,
        public readonly permissions: TreeNodeEntity[]
    ) {}

    // static fromDto(dto: TeamsFindOneItemApiDto): TeamsFindOneEntity {
    //     return new TeamsFindOneEntity(
    //         dto.id,
    //         dto.code,
    //         dto.name,
    //         dto.description,
    //         dto.report_types,
    //         dto.operators,
    //         dto.permissions
    //     );
    // }

    // public with(dto: TeamsFindOneItemApiDto): TeamsFindOneEntity {
    //     if (this.id === dto.id) {
    //         return this;
    //     }
    //     return TeamsFindOneEntity.fromDto(dto);
    // }
}
