import { Status } from '@presentation/pages/content-management/domain/enums/terms-use/terms-use-status.enum';

export interface TermsUseFilterDto {
    search?: string;
    version?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
