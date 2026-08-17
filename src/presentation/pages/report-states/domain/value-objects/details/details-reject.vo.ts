import { DetailsRejectDto } from '@pages/report-states/application/dto/details/details-reject.dto';

export class DetailsRejectVo {
    public readonly uniqId: string;
    public readonly comment: string;
    public readonly reason: string;
    public readonly callbackType: string;

    constructor(props: {
        uniqId: string;
        comment: string;
        reason: string;
        callbackType: string;
    }) {
        this.uniqId = props.uniqId;
        this.comment = props.comment;
        this.reason = props.reason;
        this.callbackType = props.callbackType;
    }

    static fromDto(dto: DetailsRejectDto): DetailsRejectVo {
        return new DetailsRejectVo({
            uniqId: dto.uniqId,
            comment: dto.comment,
            reason: dto.reason,
            callbackType: dto.callbackType,
        });
    }
}
