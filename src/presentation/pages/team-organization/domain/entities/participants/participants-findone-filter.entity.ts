import { ParticipantsFindOneFilterVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-findone-filter.vo';

export class ParticipantsFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: ParticipantsFindOneFilterVo
    ): ParticipantsFindOneFilterEntity {
        return new ParticipantsFindOneFilterEntity(vo.uniqId);
    }
}
