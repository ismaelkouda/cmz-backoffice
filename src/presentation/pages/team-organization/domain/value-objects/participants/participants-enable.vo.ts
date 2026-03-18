import { ParticipantsEnableDto } from '@pages/team-organization/application/dto/participants/participants-enable.dto';

export class ParticipantsEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ParticipantsEnableDto): ParticipantsEnableVo {
        return new ParticipantsEnableVo({
            uniqId: dto.uniqId,
        });
    }
}
