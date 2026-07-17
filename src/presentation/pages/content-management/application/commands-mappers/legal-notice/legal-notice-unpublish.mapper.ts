import { LegalNoticeUnpublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-unpublish.command';

export function legalNoticeUnpublishCommandMapper(
    command: LegalNoticeUnpublishCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
