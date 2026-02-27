import { Status } from '@presentation/pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export interface Props {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    status: Status;
    membersCount: string;
    updatedAt: string;
}
