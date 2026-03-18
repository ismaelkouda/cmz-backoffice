import { NewsDisableDto } from '@pages/content-management/application/dto/news/news-disable.dto';

export class NewsDisableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NewsDisableDto): NewsDisableVo {
        return new NewsDisableVo({
            uniqId: dto.uniqId,
        });
    }
}
