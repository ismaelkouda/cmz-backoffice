import { LegalNoticePublishCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-publish.command';

export function legalNoticePublishCommandMapper(
    command: LegalNoticePublishCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
