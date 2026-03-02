import { Status } from '@presentation/pages/content-management/domain/enums/terms-use/terms-use-status.enum';

export class TermsUseQuery {
    constructor(
        public readonly search?: string,
        public readonly version?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
