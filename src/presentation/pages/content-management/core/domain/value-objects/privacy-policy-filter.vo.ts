import { PrivacyPolicyRequestDto } from '../../application/dtos/privacy-policy/privacy-policy-request.dto';

export class PrivacyPolicyFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly version?: string,
        private readonly search?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(
        data: PrivacyPolicyRequestDto = {} as PrivacyPolicyRequestDto
    ): PrivacyPolicyFilter {
        return new PrivacyPolicyFilter(
            data.startDate,
            data.endDate,
            data.version,
            data.search,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.version) params['version'] = this.version;
        if (this.search) params['search'] = this.search;
        if (this.isPublished !== undefined) params['is_published'] = this.isPublished;

        return params;
    }
}
