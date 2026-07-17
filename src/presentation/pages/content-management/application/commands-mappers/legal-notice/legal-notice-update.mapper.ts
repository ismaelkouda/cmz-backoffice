import { LegalNoticeUpdateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-update.command';

export function legalNoticeUpdateCommandMapper(
    command: LegalNoticeUpdateCommand
) {
    return {
        uniqId: command.uniqId,
        version: command.version,
        content: command.content,
    };
}
