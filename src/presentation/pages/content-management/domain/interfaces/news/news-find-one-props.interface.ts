import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';

export interface NewsFindOneProps {
    uniqId: string;
    status: Status;
    order: number;
    type: string;
    image: string;
    video: string;
    category: string;
    subCategory: string;
    hashtags: string[];
    title: string;
    resume: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
