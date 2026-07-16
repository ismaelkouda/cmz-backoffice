import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';

export interface NewsFilterContract {
    search?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
