import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
import { AccessLogsActions } from '../enums/access-logs/access-logs-actions.enum';

export interface AccessLogsFilterProps {
    search?: string;
    action?: AccessLogsActions;
    period?: DatePeriod;
}
