import { ParticipantsFindOneFilterDto } from '@pages/team-organization/application/dto/participants/participants-find-one-filter.dto';

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
