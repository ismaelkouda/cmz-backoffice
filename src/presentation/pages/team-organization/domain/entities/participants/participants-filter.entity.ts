import { ParticipantsFilterVo } from '@pages/team-organization/domain/value-objects/participants/participants-filter.vo';
import { Roles } from '@shared/domain/enums/roles.enum';

export class ParticipantsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly role?: Roles,
        public readonly team?: string,
        public readonly status?: string
    ) {}

    static fromVo(vo: ParticipantsFilterVo): ParticipantsFilterEntity {
        return new ParticipantsFilterEntity(
            vo.search,
            vo.role,
            vo.team,
            vo.status
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            role: this.role,
            team: this.team,
            status: this.status,
        });
    }
}
