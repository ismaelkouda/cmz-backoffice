import { AccessLogsActions } from '@presentation/pages/settings-security/domain/enums/access-logs/access-logs-actions.enum';

export class AccessLogsQuery {
    constructor(
        public readonly search?: string,
        public readonly action?: AccessLogsActions,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
