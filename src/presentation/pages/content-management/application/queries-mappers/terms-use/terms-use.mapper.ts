import { TermsUseQuery } from '@pages/content-management/application/queries/terms-use/terms-use.query';

export function termsUseQueryMapper(command: TermsUseQuery) {
    return {
        search: command.search,
        version: command.version,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
