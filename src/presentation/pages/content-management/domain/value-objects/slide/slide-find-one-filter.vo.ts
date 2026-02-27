import { SlideFindOneFilterDto } from '@presentation/pages/content-management/application/dto/slide/slide-find-one-filter.dto';

export class SlideFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: SlideFindOneFilterDto): SlideFindOneFilterVo {
        return new SlideFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
