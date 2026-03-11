import { RegionsFindOneFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-find-one-filter.dto';

export class RegionsFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: RegionsFindOneFilterDto): RegionsFindOneFilterVo {
        return new RegionsFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
