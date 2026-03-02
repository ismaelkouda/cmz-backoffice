import { NewsFilterDto } from '@presentation/pages/content-management/application/dto/news/news-filter.dto';

export class NewsFilterVo {
    public readonly search?: string;
    public readonly status?: string;
    public readonly startDate?: string;
    public readonly endDate?: string;

    constructor(props: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }) {
        this.search = props.search;
        this.status = props.status;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
    }

    static fromDto(
        dto: NewsFilterDto | null = {} as NewsFilterDto
    ): NewsFilterVo {
        return new NewsFilterVo({
            search: dto?.search?.trim() || undefined,
            status: dto?.status,
            startDate: dto?.startDate,
            endDate: dto?.endDate,
        });
    }
}
