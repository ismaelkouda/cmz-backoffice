import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

export interface SiteGroupProps {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    status: Status;
    updatedAt: string;
}
