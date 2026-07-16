import { TermsUseUnpublishCommand } from '@pages/content-management/application/commands/terms-use/terms-use-unpublish.command';

export function termsUseUnpublishCommandMapper(
    command: TermsUseUnpublishCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
