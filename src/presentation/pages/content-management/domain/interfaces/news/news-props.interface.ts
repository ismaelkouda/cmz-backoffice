import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';

export interface NewsProps {
    uniqId: string;
    type: string;
    title: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
