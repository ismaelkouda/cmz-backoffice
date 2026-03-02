import { NewsFindOneFilterDto } from '@presentation/pages/content-management/application/dto/news/news-find-one-filter.dto';

export class NewsFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NewsFindOneFilterDto): NewsFindOneFilterVo {
        return new NewsFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
