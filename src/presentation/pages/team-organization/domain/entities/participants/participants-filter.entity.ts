import { ParticipantsFilterVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-filter.vo';

export class ParticipantsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly role?: string,
        public readonly isActive?: boolean
    ) {}

    static fromVo(vo: ParticipantsFilterVo): ParticipantsFilterEntity {
        return new ParticipantsFilterEntity(vo.search, vo.role, vo.isActive);
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            role: this.role,
            isActive: this.isActive,
        });
    }
}
