import { TeamsDeleteVo } from '@presentation/pages/team-organization/domain/value-objects/teams/teams-delete.vo';

export class TeamsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: TeamsDeleteVo): TeamsDeleteEntity {
        return new TeamsDeleteEntity(vo.uniqId);
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
