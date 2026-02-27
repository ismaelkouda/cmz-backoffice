import { Status } from '@presentation/pages/content-management/domain/enums/news/news-status.enum';

export class NewsQuery {
    constructor(
        public readonly search?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
