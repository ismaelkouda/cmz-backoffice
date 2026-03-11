import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';

export class NewsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NewsDeleteDto): NewsDeleteVo {
        return new NewsDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
