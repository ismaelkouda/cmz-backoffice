import { Status } from '@presentation/pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export class PrivacyPolicyQuery {
    constructor(
        public readonly search?: string,
        public readonly version?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
