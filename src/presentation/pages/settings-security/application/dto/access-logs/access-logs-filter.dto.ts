import { AccessLogsActions } from '@presentation/pages/settings-security/domain/enums/access-logs/access-logs-actions.enum';

export interface AccessLogsFilterDto {
    search?: string;
    action?: AccessLogsActions;
    startDate?: string;
    endDate?: string;
}
