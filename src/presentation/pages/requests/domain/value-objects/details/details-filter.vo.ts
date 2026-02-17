import { DetailsFilterDto } from '@presentation/pages/requests/application/dto/details/details-filter.dto';

export class DetailsFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: DetailsFilterDto): DetailsFilterVo {
        return new DetailsFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
