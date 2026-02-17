import { DetailsRejectDto } from '@presentation/pages/requests/application/dto/details/details-reject.dto';

export class DetailsRejectVo {
    public readonly uniqId: string;
    public readonly comment: string;
    public readonly reason: string;

    constructor(props: { uniqId: string; comment: string; reason: string }) {
        this.uniqId = props.uniqId;
        this.comment = props.comment;
        this.reason = props.reason;
    }

    static fromDto(dto: DetailsRejectDto): DetailsRejectVo {
        return new DetailsRejectVo({
            uniqId: dto.uniqId,
            comment: dto.comment,
            reason: dto.reason,
        });
    }
}
