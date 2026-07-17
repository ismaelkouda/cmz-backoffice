import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';

export interface SiteGroupFilterContract {
    search?: string;
    status?: Status;
    startDate?: Date;
    endDate?: Date;
}
