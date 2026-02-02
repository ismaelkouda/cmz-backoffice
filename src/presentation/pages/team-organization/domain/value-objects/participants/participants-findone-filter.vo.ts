import { ParticipantsFindOneFilterDto } from '@presentation/pages/team-organization/application/dtos/participants/participants-findone-filter.dto';

export class ParticipantsFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: ParticipantsFindOneFilterDto
    ): ParticipantsFindOneFilterVo {
        return new ParticipantsFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
