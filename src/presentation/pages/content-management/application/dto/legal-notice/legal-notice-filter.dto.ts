import { Status } from '@presentation/pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export interface LegalNoticeFilterDto {
    search?: string;
    version?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
