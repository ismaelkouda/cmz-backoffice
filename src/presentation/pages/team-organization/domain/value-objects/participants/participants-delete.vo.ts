import { ParticipantsDeleteDto } from '@pages/team-organization/application/dto/participants/participants-delete.dto';

export class ParticipantsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: ParticipantsDeleteDto): ParticipantsDeleteVo {
        return new ParticipantsDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
