import { TermsUseFindOneQuery } from '@pages/content-management/application/queries/terms-use/terms-use-find-one.query';

export function termsUseFindOneQueryMapper(command: TermsUseFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
