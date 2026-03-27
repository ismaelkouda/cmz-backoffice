import { NewsPublishDto } from '@pages/content-management/application/dto/news/news-publish.dto';

export class NewsPublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NewsPublishDto): NewsPublishVo {
        return new NewsPublishVo({
            uniqId: dto.uniqId,
        });
    }
}
