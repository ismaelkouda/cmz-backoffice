import { DetailsTakeDto } from '@presentation/pages/requests/application/dto/details/details-take.dto';

export class DetailsTakeVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: DetailsTakeDto): DetailsTakeVo {
        return new DetailsTakeVo({
            uniqId: dto.uniqId,
        });
    }
}
