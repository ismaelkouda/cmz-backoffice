import { NewsFilterVo } from '@presentation/pages/content-management/domain/value-objects/news/news-filter.vo';

export class NewsFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly status?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}

    static fromVo(vo: NewsFilterVo): NewsFilterEntity {
        return new NewsFilterEntity(
            vo.search,
            vo.status,
            vo.startDate,
            vo.endDate
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            status: this.status,
            startDate: this.startDate,
            endDate: this.endDate,
        });
    }
}
