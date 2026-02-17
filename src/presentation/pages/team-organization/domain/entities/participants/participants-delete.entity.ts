import { ParticipantsDeleteVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-delete.vo';

export class ParticipantsDeleteEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ParticipantsDeleteVo): ParticipantsDeleteEntity {
        return new ParticipantsDeleteEntity(vo.uniqId);
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
