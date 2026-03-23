import { NewsUnpublishDto } from '@presentation/pages/content-management/application/dto/news/news-unpublish.dto';

export class NewsUnpublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NewsUnpublishDto): NewsUnpublishVo {
        return new NewsUnpublishVo({
            uniqId: dto.uniqId,
        });
    }
}
