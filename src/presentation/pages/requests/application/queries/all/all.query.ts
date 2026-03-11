import { Status } from '@pages/requests/domain/enums/all/all-status.enum';

export class AllQuery {
    constructor(
        public readonly initiatorPhoneNumber?: string,
        public readonly uniqId?: string,
        public readonly reportType?: string,
        public readonly operators?: string[],
        public readonly source?: string,
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}
}
