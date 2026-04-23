import { TeamsCreateVo } from '@pages/team-organization/domain/value-objects/teams/teams-create.vo';

export class TeamsCreateEntity {
    constructor(
        // public readonly code: string,
        public readonly name: string,
        public readonly description: string,
        public readonly operators: string[],
        public readonly reportTypes: string[],
        public readonly permissions: string[]
    ) {}

    static fromVo(vo: TeamsCreateVo): TeamsCreateEntity {
        return new TeamsCreateEntity(
            // vo.code,
            vo.name,
            vo.description,
            vo.operators,
            vo.reportTypes,
            vo.permissions
        );
    }
}
