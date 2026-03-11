import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';

export interface Props {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    status: Status;
    membersCount: string;
    updatedAt: string;
}
