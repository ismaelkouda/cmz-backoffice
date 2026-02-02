import { TeamsCreateVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-create.vo';

export class TeamsCreateEntity {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly description: string
    ) {}

    static fromVo(vo: TeamsCreateVo): TeamsCreateEntity {
        return new TeamsCreateEntity(
            vo.code,
            vo.name,
            vo.description
        );
    }
}
