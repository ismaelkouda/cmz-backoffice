import { LegalNoticeCreateCommand } from '@pages/content-management/application/commands/legal-notice/legal-notice-create.command';

export function legalNoticeCreateCommandMapper(
    command: LegalNoticeCreateCommand
) {
    return {
        content: command.content,
        version: command.version,
    };
}
