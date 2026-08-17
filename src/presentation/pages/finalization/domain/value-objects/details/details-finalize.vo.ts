import { DetailsFinalizeDto } from '@pages/finalization/application/dto/details/details-finalize.dto';

export class DetailsFinalizeVo {
    public readonly uniqId: string;
    public readonly comment: string;

    constructor(props: { uniqId: string; comment: string }) {
        this.uniqId = props.uniqId;
        this.comment = props.comment;
    }

    static fromDto(dto: DetailsFinalizeDto): DetailsFinalizeVo {
        return new DetailsFinalizeVo({
            uniqId: dto.uniqId,
            comment: dto.comment,
        });
    }
}
