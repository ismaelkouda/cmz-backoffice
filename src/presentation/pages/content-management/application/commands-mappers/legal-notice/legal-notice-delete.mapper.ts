import { LegalNoticeDeleteCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-delete.command';

export function legalNoticeDeleteCommandMapper(
    command: LegalNoticeDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
