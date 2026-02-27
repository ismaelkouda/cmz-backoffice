import { NewsEnableDto } from '@presentation/pages/content-management/application/dto/news/news-enable.dto';

export class NewsEnableVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: NewsEnableDto): NewsEnableVo {
        return new NewsEnableVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
