import { TermsUseCreateCommand } from '@pages/content-management/application/commands/terms-use/terms-use-create.command';

export function termsUseCreateCommandMapper(command: TermsUseCreateCommand) {
    return {
        version: command.version,
        content: command.content,
    };
}
