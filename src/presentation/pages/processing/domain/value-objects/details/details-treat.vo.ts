import { DetailsTreatDto } from '@pages/processing/application/dto/details/details-treat.dto';

export class DetailsTreatVo {
    public readonly uniqId: string;
    public readonly comment: string;

    constructor(props: { uniqId: string; comment: string }) {
        this.uniqId = props.uniqId;
        this.comment = props.comment;
    }

    static fromDto(dto: DetailsTreatDto): DetailsTreatVo {
        return new DetailsTreatVo({
            uniqId: dto.uniqId,
            comment: dto.comment,
        });
    }
}
