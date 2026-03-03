import { TeamsUpdateVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-update.vo';

export class TeamsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly code: string,
        public readonly name: string,
        public readonly description: string,
        public readonly operators: string[],
        public readonly reportTypes: string[],
        public readonly permissions: string[]
    ) {}

    static fromVo(vo: TeamsUpdateVo): TeamsUpdateEntity {
        return new TeamsUpdateEntity(
            vo.uniqId,
            vo.code,
            vo.name,
            vo.description,
            vo.operators,
            vo.reportTypes,
            vo.permissions
        );
    }
}
