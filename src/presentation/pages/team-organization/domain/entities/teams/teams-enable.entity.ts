import { TeamsEnableVo } from '@pages/team-organization/domain/value-objects/teams/teams-enable.vo';

export class TeamsEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TeamsEnableVo): TeamsEnableEntity {
        return new TeamsEnableEntity(vo.uniqId);
    }

    appliesToAdminScope(): boolean {
        return this.uniqId === 'ADMIN_ACTION';
    }

    describe(): string {
        return JSON.stringify({
            uniqId: this.uniqId,
        });
    }
}
