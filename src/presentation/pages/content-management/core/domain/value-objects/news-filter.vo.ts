import { NewsRequestDto } from '../../application/dtos/news/news-request.dto';

export class NewsFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly search?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(data: NewsRequestDto = {} as NewsRequestDto): NewsFilter {
        return new NewsFilter(
            data.startDate,
            data.endDate,
            data.search,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.search) params['search'] = this.search;
        if (this.isPublished !== undefined) params['is_published'] = this.isPublished;

        return params;
    }
}
