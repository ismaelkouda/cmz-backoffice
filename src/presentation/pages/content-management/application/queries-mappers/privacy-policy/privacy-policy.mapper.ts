import { PrivacyPolicyQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy.query';

export function privacyPolicyQueryMapper(command: PrivacyPolicyQuery) {
    return {
        search: command.search,
        version: command.version,
        status: command.status,
        startDate: command.startDate,
        endDate: command.endDate,
    };
}
