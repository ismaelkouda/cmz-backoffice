import { LegalNoticeFindOneQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';

export function legalNoticeFindOneQueryMapper(
    command: LegalNoticeFindOneQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
