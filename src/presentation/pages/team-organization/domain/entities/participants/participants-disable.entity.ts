import { ParticipantsDisableVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-disable.vo';

export class ParticipantsDisableEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ParticipantsDisableVo): ParticipantsDisableEntity {
        return new ParticipantsDisableEntity(vo.uniqId);
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
