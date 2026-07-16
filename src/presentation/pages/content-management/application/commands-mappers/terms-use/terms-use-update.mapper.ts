import { TermsUseUpdateCommand } from '@pages/content-management/application/commands/terms-use/terms-use-update.command';

export function termsUseUpdateCommandMapper(command: TermsUseUpdateCommand) {
    return {
        uniqId: command.uniqId,
        version: command.version,
        content: command.content,
    };
}
