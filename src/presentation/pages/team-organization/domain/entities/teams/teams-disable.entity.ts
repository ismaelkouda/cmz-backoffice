import { TeamsDisableVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-disable.vo';

export class TeamsDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TeamsDisableVo): TeamsDisableEntity {
        return new TeamsDisableEntity(vo.uniqId);
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
