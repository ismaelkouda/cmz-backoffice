import { Status } from '@presentation/pages/content-management/domain/enums/news/news-status.enum';

export interface NewsFilterDto {
    search?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
