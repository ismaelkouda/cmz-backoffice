import { TermsUsePublishCommand } from '@pages/content-management/application/commands/terms-use/terms-use-publish.command';

export function termsUsePublishCommandMapper(command: TermsUsePublishCommand) {
    return {
        uniqId: command.uniqId,
    };
}
