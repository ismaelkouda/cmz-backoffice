import { DetailsApproveDto } from '@pages/requests/application/dto/details/details-approve.dto';

export class DetailsApproveVo {
    public readonly uniqId: string;
    public readonly comment: string;

    constructor(props: { uniqId: string; comment: string }) {
        this.uniqId = props.uniqId;
        this.comment = props.comment;
    }

    static fromDto(dto: DetailsApproveDto): DetailsApproveVo {
        return new DetailsApproveVo({
            uniqId: dto.uniqId,
            comment: dto.comment,
        });
    }
}
