import { MediaStatusDto } from '@shared/data/dtos/media-status.dto';
import { NewsRequestDto } from '../../application/dtos/news/news-request.dto';

export class NewsFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly search?: string,
        private readonly status?: MediaStatusDto
    ) {}

    static create(data: NewsRequestDto = {} as NewsRequestDto): NewsFilter {
        return new NewsFilter(
            data.startDate,
            data.endDate,
            data.search,
            data.status
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.search) params['search'] = this.search;
        if (this.status) params['status'] = this.status;

        return params;
    }
}
