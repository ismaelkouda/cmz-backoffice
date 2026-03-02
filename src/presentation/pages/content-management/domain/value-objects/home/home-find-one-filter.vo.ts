import { HomeFindOneFilterDto } from '@presentation/pages/content-management/application/dto/home/home-find-one-filter.dto';

export class HomeFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: HomeFindOneFilterDto): HomeFindOneFilterVo {
        return new HomeFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
