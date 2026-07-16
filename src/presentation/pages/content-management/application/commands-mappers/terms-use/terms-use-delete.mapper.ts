import { TermsUseDeleteCommand } from '@pages/content-management/application/commands/terms-use/terms-use-delete.command';

export function termsUseDeleteCommandMapper(command: TermsUseDeleteCommand) {
    return {
        uniqId: command.uniqId,
    };
}
