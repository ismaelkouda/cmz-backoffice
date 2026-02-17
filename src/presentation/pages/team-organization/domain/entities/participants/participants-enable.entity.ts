import { ParticipantsEnableVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-enable.vo';

export class ParticipantsEnableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ParticipantsEnableVo): ParticipantsEnableEntity {
        return new ParticipantsEnableEntity(vo.uniqId);
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
