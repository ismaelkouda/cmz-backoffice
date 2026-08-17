import { LegalNoticeQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice.query';

export function legalNoticeQueryMapper(command: LegalNoticeQuery) {
    return {
        search: command.search,
        version: command.version,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
