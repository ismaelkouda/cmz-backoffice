import { ParticipantsDisableDto } from '@pages/team-organization/application/dto/participants/participants-disable.dto';

export class ParticipantsDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ParticipantsDisableDto): ParticipantsDisableVo {
        return new ParticipantsDisableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
