import { AccessLogsQuery } from '@pages/settings-security/application/queries/access-logs/access-logs.query';

export function accessLogsQueryMapper(query: AccessLogsQuery) {
    return {
        search: query.search,
        action: query.action,
        startDate: query.startDate,
        endDate: query.endDate,
    };
}
